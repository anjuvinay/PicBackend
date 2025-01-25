import { Request, Response } from "express";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AuthUseCases } from "../../application/usecases/auth/AuthUseCases";
import jwt from 'jsonwebtoken';

const userRepo=new UserRepository()
const authUseCases = new AuthUseCases(userRepo)



const registerUser = async(req: Request, res: Response): Promise<void> =>{
  try {
    const message = await authUseCases.register(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An error occurred during registration',
    });
    console.log(error)
  }
}



  


const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body.userData;

    const { token, user } = await authUseCases.login(email, password);
    console.log("user in login:", user)

    res.status(200).json({
      message: 'Login successful',
      token,
      user, 
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || 'An error occurred during login',
    });
  }
};




const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
      const { email } = req.body;
      const message = await authUseCases.forgotPassword(email);
      res.status(200).json({ message });
  } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to send OTP' });
  }
};



const resetPassword = async (req: Request, res: Response): Promise<void> => {
  console.log("Reached reset password")

try {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and new password are required' });
        return;
    }

    const message = await authUseCases.resetPassword(email, password);

    res.status(200).json({ message });
} catch (error: any) {
    console.error("Error in resetPassword:", error.message);
    res.status(400).json({ message: error.message || 'Password reset failed' });
}
};




const verifyOtp = async (req: Request, res: Response): Promise<void> => {
try {
    const { email, otp } = req.body;
    const message = await authUseCases.verifyOtp(email, otp);
    res.status(200).json({ message });
} catch (error: any) {
    res.status(400).json({ message: error.message || 'OTP verification failed' });
}
};






  const otpResend = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log("otpResent: "+email)
  
      const message = await authUseCases.resendOtp(email);
  
      res.status(200).json({ message });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message || "An error occurred while resending OTP" });
    }
  };









    
     


  export default {registerUser,
                 userLogin,
                 forgotPassword,
                 resetPassword,
                 verifyOtp,
                 //otpRegister,
                 otpResend



                
                 
    }