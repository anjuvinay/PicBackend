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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const NODEMAIL_EMAIL = 'aanjups88@gmail.com';
const NODEMAIL_PASS_KEY = "nciiejprzhlsejzr";
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAIL_EMAIL,
        pass: NODEMAIL_PASS_KEY,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const sendVerificationEmail = (userEmailId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpValue = Math.floor(100000 + Math.random() * 900000);
        console.log("OTP: " + otpValue);
        const mailContent = {
            from: NODEMAIL_EMAIL,
            to: userEmailId,
            subject: 'OTP Verification',
            html: `
                <h2>Your Verification OTP for Mr&Mrs Matrimony</h2>
                <h3>Here is your otp:</h3>
                <h1>${otpValue}</h1>
            `,
        };
        yield transporter.sendMail(mailContent);
        return { otpValue, result: true };
    }
    catch (error) {
        console.error(error, 'Mail send error');
        return { otpValue: 0, result: false };
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
