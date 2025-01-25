import express from 'express';
import authController from '../controller/authController';
import imageController from '../controller/imageController';
import { upload, uploadFields } from '../middlewares/multerConfig';
import { authMiddleware } from '../middlewares/authMiddleware';



const router = express.Router();


router.post('/register', authController.registerUser);
router.post('/login', authController.userLogin);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-otp', authController.otpResend);


router.post('/upload',authMiddleware, uploadFields,imageController.uploadImages);
router.get('/images', authMiddleware, imageController.getImages);
router.delete('/image', authMiddleware, imageController.deleteImage);
router.put('/image', authMiddleware, upload.single('image'), imageController.editImage);
router.post('/reorder', authMiddleware, imageController.reorderImages);









export default router