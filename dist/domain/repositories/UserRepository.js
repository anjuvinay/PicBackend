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
exports.UserRepository = void 0;
const UserModel_1 = __importDefault(require("../../infrastructure/models/UserModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id))
                return null;
            const userDoc = yield UserModel_1.default.findById(id).exec();
            return userDoc ? this.toDomain(userDoc) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield UserModel_1.default.findOne({ email }).exec();
            return userDoc ? this.toDomain(userDoc) : null;
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new UserModel_1.default(Object.assign(Object.assign({}, user), { _id: new mongoose_1.default.Types.ObjectId() }));
            const savedUser = yield newUser.save();
            return this.toDomain(savedUser);
        });
    }
    updateUser(id, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id))
                return null;
            const updatedUser = yield UserModel_1.default.findByIdAndUpdate(id, userDetails, {
                new: true,
            }).exec();
            return updatedUser ? this.toDomain(updatedUser) : null;
        });
    }
    toDomain(userDoc) {
        return {
            id: userDoc._id.toString(),
            name: userDoc.name,
            email: userDoc.email,
            phone: userDoc.phone,
            password: userDoc.password,
        };
    }
}
exports.UserRepository = UserRepository;
