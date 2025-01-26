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
exports.ImageRepository = void 0;
const ImageModel_1 = __importDefault(require("../../infrastructure/models/ImageModel"));
class ImageRepository {
    storeImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedDocs = yield ImageModel_1.default.insertMany(images);
            return insertedDocs.map((doc) => ({
                userId: doc.userId,
                title: doc.title,
                imagePath: doc.imagePath,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        });
    }
    getImagesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield ImageModel_1.default.find({ userId }).sort({ order: 1 }).exec();
            return docs.map((doc) => ({
                id: doc.id,
                userId: doc.userId,
                title: doc.title,
                imagePath: doc.imagePath,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        });
    }
    deleteImage(Id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ImageModel_1.default.deleteOne({ _id: Id, userId }).exec();
            if (result.deletedCount === 0) {
                throw new Error('Image not found or not authorized to delete');
            }
        });
    }
    updateImage(id, userId, title, imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (title)
                updateData.title = title;
            if (imagePath)
                updateData.imagePath = imagePath;
            const updatedDoc = yield ImageModel_1.default.findOneAndUpdate({ _id: id, userId }, updateData, { new: true } // Return the updated document
            ).exec();
            return updatedDoc
                ? {
                    id: updatedDoc._id.toString(), // Explicitly cast `_id` to string
                    userId: updatedDoc.userId,
                    title: updatedDoc.title,
                    imagePath: updatedDoc.imagePath,
                    createdAt: updatedDoc.createdAt,
                    updatedAt: updatedDoc.updatedAt,
                }
                : null;
        });
    }
    updateImageOrder(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulkOperations = images.map((image, index) => ({
                updateOne: {
                    filter: { _id: image.id, userId: image.userId },
                    update: { $set: { order: index + 1 } }, // Use `index + 1` for new order
                },
            }));
            yield ImageModel_1.default.bulkWrite(bulkOperations);
        });
    }
    getImageById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ImageModel_1.default.findOne({ _id: id, userId }).exec();
        });
    }
}
exports.ImageRepository = ImageRepository;
