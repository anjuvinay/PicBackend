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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagesUseCase = uploadImagesUseCase;
exports.getUserImagesUseCase = getUserImagesUseCase;
exports.deleteUserImageUseCase = deleteUserImageUseCase;
exports.editImageUseCase = editImageUseCase;
exports.updateOrderUseCase = updateOrderUseCase;
function uploadImagesUseCase(_a, imageRepository_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, filePaths, titles }, imageRepository) {
        if (!filePaths || filePaths.length === 0) {
            throw new Error('No files provided');
        }
        if (!titles || titles.length !== filePaths.length) {
            throw new Error('Titles array must match the number of files');
        }
        const imagesToStore = filePaths.map((path, idx) => ({
            userId,
            title: titles[idx],
            imagePath: path,
        }));
        const storedImages = yield imageRepository.storeImages(imagesToStore);
        return storedImages;
    });
}
function getUserImagesUseCase(userId, imageRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            throw new Error('userId is required');
        }
        return imageRepository.getImagesByUserId(userId);
    });
}
function deleteUserImageUseCase(Id, userId, imageRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Id || !userId) {
            throw new Error('imageId and userId are required');
        }
        yield imageRepository.deleteImage(Id, userId);
    });
}
function editImageUseCase(id, userId, title, file, imageRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || !userId) {
            throw new Error('Invalid input for editing image');
        }
        let newImagePath;
        if (file) {
            newImagePath = `uploads/${file.filename}`;
        }
        const updatedImage = yield imageRepository.updateImage(id, userId, title, newImagePath);
        if (!updatedImage) {
            throw new Error('Image not found or not authorized to update');
        }
        return updatedImage;
    });
}
function updateOrderUseCase(reorderedImages, userId, imageRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!reorderedImages || reorderedImages.length === 0) {
            throw new Error("No images provided for reordering");
        }
        console.log("Authenticated UserId:", userId);
        console.log("Reordered Images:", reorderedImages);
        // Check if all images belong to the authenticated user
        for (const image of reorderedImages) {
            console.log(`Validating image ${image.id}: userId=${image.userId}`);
            if (image.userId !== userId) {
                console.error(`Unauthorized operation for image: ${image.id}`);
                throw new Error("Unauthorized operation");
            }
        }
        // Proceed to update the image order in the repository
        yield imageRepository.updateImageOrder(reorderedImages);
    });
}
