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
dotenv_1.default.config();
const imageRepository = new ImageRepository_1.ImageRepository();
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Reached Controller");
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log("UserId", userId);
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
            res.status(400).json({ success: false, message: 'Titles do not match number of images.' });
            return;
        }
        const filePaths = files.map((file) => `uploads/${file.filename}`);
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
        console.log("Image array", images);
        const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:8000';
        const fullImagePaths = images.map((image) => ({
            id: image.id,
            title: image.title,
            url: `${serverBaseUrl}/${image.imagePath}`,
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
        const { Id } = req.body;
        console.log("imageId or image path", Id);
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        yield (0, imageUseCases_1.deleteUserImageUseCase)(Id, userId, imageRepository);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Image deletion failed.',
        });
    }
});
const editImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id, title } = req.body;
        const file = req.file || null;
        if (!userId || !id) {
            res.status(400).json({ success: false, message: 'Invalid request data' });
            return;
        }
        const updatedImage = yield (0, imageUseCases_1.editImageUseCase)(id, userId, title, file, imageRepository);
        res.status(200).json({
            success: true,
            message: 'Image updated successfully',
            data: updatedImage,
        });
    }
    catch (error) {
        console.error('Error editing image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Image update failed',
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
