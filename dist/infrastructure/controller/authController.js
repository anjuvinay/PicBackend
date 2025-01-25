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
const UserRepository_1 = require("../../domain/repositories/UserRepository");
const AuthUseCases_1 = require("../../application/usecases/auth/AuthUseCases");
const userRepo = new UserRepository_1.UserRepository();
const authUseCases = new AuthUseCases_1.AuthUseCases(userRepo);
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield authUseCases.register(req.body);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'An error occurred during registration',
        });
        console.log(error);
    }
});
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body.userData;
        const { token, user } = yield authUseCases.login(email, password);
        console.log("user in login:", user);
        res.status(200).json({
            message: 'Login successful',
            token,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            message: error.message || 'An error occurred during login',
        });
    }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const message = yield authUseCases.forgotPassword(email);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to send OTP' });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Reached reset password");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and new password are required' });
            return;
        }
        const message = yield authUseCases.resetPassword(email, password);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(400).json({ message: error.message || 'Password reset failed' });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const message = yield authUseCases.verifyOtp(email, otp);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'OTP verification failed' });
    }
});
const otpResend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log("otpResent: " + email);
        const message = yield authUseCases.resendOtp(email);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || "An error occurred while resending OTP" });
    }
});
exports.default = { registerUser,
    userLogin,
    forgotPassword,
    resetPassword,
    verifyOtp,
    //otpRegister,
    otpResend
};
