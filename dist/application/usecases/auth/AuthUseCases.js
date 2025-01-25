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
exports.AuthUseCases = void 0;
const OtpService_1 = require("../../services/OtpService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthUseCases {
    constructor(userRepo) {
        this.globalStoredOtp = null;
        this.otpExpirationTime = null;
        this.OTP_EXPIRATION_TIME = 30 * 1000;
        this.verifiedEmails = new Set();
        this.userRepository = userRepo;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, password } = userData;
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Account already exists');
            }
            const hashedPassword = yield this.hashPassword(password);
            let createdEntity;
            createdEntity = yield this.userRepository.createUser({
                name: name,
                email,
                phone,
                password: hashedPassword,
            });
            return 'user registered succesfully';
        });
    }
    login(emailParam, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(emailParam);
            console.log("user loggedin", user);
            if (!user) {
                throw new Error('Account does not exist');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid Password');
            }
            if (!user.id) {
                throw new Error("User ID is undefined");
            }
            const token = this.generateToken(user.id);
            const { name } = user;
            return {
                token,
                user: { name }
            };
        });
    }
    otpRegister(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.globalStoredOtp === null || this.otpExpirationTime === null) {
                throw new Error('OTP has not been generated or expired');
            }
            const currentTime = Date.now();
            if (currentTime > this.otpExpirationTime) {
                this.globalStoredOtp = null;
                this.otpExpirationTime = null;
                throw new Error('OTP has expired');
            }
            if (otp !== this.globalStoredOtp) {
                throw new Error('Invalid OTP');
            }
            this.globalStoredOtp = null;
            this.otpExpirationTime = null;
            return {
                status: 200,
                message: "OTP verified successfully, user registered.",
            };
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otpValue, result } = yield (0, OtpService_1.sendVerificationEmail)(email);
            this.otpExpirationTime = Date.now() + 30 * 1000;
            if (!result || !otpValue) {
                throw new Error("Failed to send OTP. Try again later.");
            }
            this.globalStoredOtp = otpValue;
            return "OTP resent successfully";
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reached reset password");
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const hashedPassword = yield this.hashPassword(newPassword);
            if (!user.id) {
                throw new Error('User not found');
            }
            yield this.userRepository.updateUser(user.id, { password: hashedPassword });
            this.verifiedEmails.delete(email);
            return 'Password reset successfully';
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.globalStoredOtp === null || this.otpExpirationTime === null) {
                throw new Error('OTP has not been generated or has expired');
            }
            const currentTime = Date.now();
            if (currentTime > this.otpExpirationTime) {
                this.globalStoredOtp = null;
                this.otpExpirationTime = null;
                throw new Error('OTP has expired');
            }
            if (String(otp).trim() !== String(this.globalStoredOtp).trim()) {
                throw new Error('Invalid OTP');
            }
            this.verifiedEmails.add(email);
            this.globalStoredOtp = null;
            this.otpExpirationTime = null;
            return 'OTP verified successfully';
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const { otpValue, result } = yield (0, OtpService_1.sendVerificationEmail)(email);
            if (!result) {
                throw new Error('Failed to send OTP');
            }
            this.globalStoredOtp = otpValue;
            console.log("Global stored OTP for password reset:", otpValue);
            this.otpExpirationTime = Date.now() + this.OTP_EXPIRATION_TIME;
            return 'OTP sent successfully. Please check your email.';
        });
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return bcrypt_1.default.hash(password, salt);
        });
    }
}
exports.AuthUseCases = AuthUseCases;
