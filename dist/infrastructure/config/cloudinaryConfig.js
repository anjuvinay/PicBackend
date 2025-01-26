"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: 'decsdyzt1',
    api_key: '155131951395924',
    api_secret: 'puvhj3i9HaTSzTUpBcL2uJi7GwA',
});
exports.default = cloudinary_1.v2;
