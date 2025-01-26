"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageRepository_1 = require("../../domain/repositories/ImageRepository");
const imageUseCases_1 = require("../../application/usecases/image/imageUseCases");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
const imageRepository = new ImageRepository_1.ImageRepository();
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ success: false, message: 'No images uploaded.' });
            return;
        }
        let titles = req.body.titles;
        if (!titles) {
            titles = [];
        }
        else if (!Array.isArray(titles)) {
            titles = [titles];
        }
        if (titles.length !== files.length) {
            res.status(400).json({ success: false, message: 'Titles do not match the number of images.' });
            return;
        }
        // Cloudinary file URLs
        const filePaths = files.map((file) => file.path);
        const storedImages = yield (0, imageUseCases_1.uploadImagesUseCase)({ userId, filePaths, titles }, imageRepository);
        res.status(200).json({
            success: true,
            data: storedImages,
        });
    }
    catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Image upload failed.',
        });
    }
});
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const images = yield (0, imageUseCases_1.getUserImagesUseCase)(userId, imageRepository);
        // Ensure URLs are correctly set
        const fullImagePaths = images.map((image) => ({
            id: image.id,
            title: image.title,
            url: image.imagePath, // Use imagePath directly for Cloudinary images
        }));
        res.status(200).json({
            success: true,
            data: fullImagePaths,
        });
    }
    catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching images.',
        });
    }
});
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (!id) {
            res.status(400).json({ success: false, message: "Image ID is required" });
            return;
        }
        // Fetch the image from the database
        const image = yield imageRepository.getImageById(id, userId);
        if (!image) {
            res.status(404).json({ success: false, message: "Image not found" });
            return;
        }
        // Extract the publicId from the imagePath
        const publicIdMatch = image.imagePath.match(/\/([^/]+)\.[a-z]+$/i);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;
        if (!publicId) {
            res.status(400).json({ success: false, message: "Invalid image URL or public ID" });
            return;
        }
        // Delete the image from Cloudinary
        yield cloudinary_1.v2.uploader.destroy(publicId);
        // Delete the image from the database
        yield imageRepository.deleteImage(id, userId);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Image deletion failed.",
        });
    }
});
const editImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id, title } = req.body;
        const file = req.file; // Optional new image file
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (!id) {
            res.status(400).json({ success: false, message: "Image ID is required" });
            return;
        }
        // Find the image in the database
        const image = yield imageRepository.getImageById(id, userId);
        if (!image) {
            res.status(404).json({ success: false, message: "Image not found" });
            return;
        }
        let updatedImagePath = image.imagePath;
        // If a new file is uploaded, replace the image in Cloudinary
        if (file) {
            const publicIdMatch = image.imagePath.match(/\/([^/]+)\.[a-z]+$/i);
            const publicId = publicIdMatch ? publicIdMatch[1] : null;
            if (publicId) {
                // Delete the old image from Cloudinary
                yield cloudinary_1.v2.uploader.destroy(publicId);
            }
            // Upload the new image to Cloudinary
            const uploadResult = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "picStack",
            });
            updatedImagePath = uploadResult.secure_url;
        }
        // Update the image in the database
        const updatedImage = yield imageRepository.updateImage(id, userId, title, updatedImagePath);
        res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedImage,
        });
    }
    catch (error) {
        console.error("Error editing image:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Image update failed.",
        });
    }
});
const reorderImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Reached reorder images controller");
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Authenticated user's ID
        const { reorderedImages } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (!reorderedImages || !Array.isArray(reorderedImages)) {
            res.status(400).json({ success: false, message: "Invalid input data" });
            return;
        }
        // Override userId for all images to ensure consistency
        const imagesWithUserId = reorderedImages.map((image) => (Object.assign(Object.assign({}, image), { userId })));
        yield (0, imageUseCases_1.updateOrderUseCase)(imagesWithUserId, userId, imageRepository);
        res.status(200).json({
            success: true,
            message: "Order updated successfully!",
        });
    }
    catch (error) {
        console.error("Error reordering images:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Image reordering failed.",
        });
    }
});
exports.default = { uploadImages,
    getImages,
    deleteImage,
    editImage,
    reorderImages,
};
