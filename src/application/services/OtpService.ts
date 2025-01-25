import nodemailer from 'nodemailer'

const NODEMAIL_EMAIL = 'aanjups88@gmail.com' as string;
const NODEMAIL_PASS_KEY = "nciiejprzhlsejzr" as string;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAIL_EMAIL,
        pass: NODEMAIL_PASS_KEY,
    },
    tls: {
        rejectUnauthorized: false,
    },
});


export const sendVerificationEmail = async (userEmailId: string): Promise<{ otpValue: number; result: boolean }> => {
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

        await transporter.sendMail(mailContent); 
        return { otpValue, result: true }; 
    } catch (error) {
        console.error(error, 'Mail send error');
        return { otpValue: 0, result: false }; 
    }
};




