
import { User, PublicUser } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { IUserRepository } from "../../../domain/repositories/interfaces/IUserRepository";
import { IUser } from "../../../types/User.js";
import { sendVerificationEmail } from "../../services/OtpService";
import dotenv from "dotenv";

dotenv.config();




import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export class AuthUseCases {
  private userRepository: IUserRepository;
  private globalStoredOtp: number | null = null;
  private otpExpirationTime: number | null = null; 


  OTP_EXPIRATION_TIME = 30 * 1000; 




  constructor(userRepo: IUserRepository) {
    this.userRepository = userRepo;
    
  }

  

   async register(userData: Partial<User>): Promise<string> {
     const { name, email, phone, password } = userData;

     const existingUser = await this.userRepository.findByEmail(email!);
  

     if (existingUser) {
       throw new Error('Account already exists');
     }

     const hashedPassword = await this.hashPassword(password as string);
     let createdEntity: User;

        createdEntity = await this.userRepository.createUser({
        name: name,
        email,
        phone,
        password: hashedPassword,
        
      } as User);

     return 'user registered succesfully';
   }



  



  async login(emailParam: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const user = await this.userRepository.findByEmail(emailParam);
    console.log("user loggedin", user)
    if (!user) {
      throw new Error('Account does not exist');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid Password');
    }
   
  
    if (!user.id) {
      throw new Error("User ID is undefined");
    }
 
  
    const token = this.generateToken(user.id!);
    const {name } = user;
  
    return { 
      token, 
      user: { name} 
    };
  }



  async otpRegister( otp: number): Promise<any> {

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
  }

  

  async resendOtp(email: string): Promise<string> {
   
    const { otpValue, result } = await sendVerificationEmail(email);

    this.otpExpirationTime = Date.now() + 30 * 1000

    if (!result || !otpValue) {
      throw new Error("Failed to send OTP. Try again later.");
    }
  
    this.globalStoredOtp = otpValue;
    return "OTP resent successfully";
  }



  async resetPassword(email: string, newPassword: string): Promise<string> {
    console.log("Reached reset password")
    
  
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
  
    const hashedPassword = await this.hashPassword(newPassword);
  
    if (!user.id) {
      throw new Error('User not found');
  }
  
    await this.userRepository.updateUser(user.id, { password: hashedPassword });
  
    this.verifiedEmails.delete(email);
  
    return 'Password reset successfully';
  }
  
  
  
  
  
  
  
  private verifiedEmails = new Set<string>(); 
  
  async verifyOtp(email: string, otp: number): Promise<string> {
  
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
  }
  
  
  
  
  
  async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
  
    const { otpValue, result } = await sendVerificationEmail(email);
    if (!result) {
        throw new Error('Failed to send OTP');
    }
  
    this.globalStoredOtp = otpValue;
    console.log("Global stored OTP for password reset:", otpValue);
    this.otpExpirationTime = Date.now() + this.OTP_EXPIRATION_TIME;
  
    return 'OTP sent successfully. Please check your email.';
  }
  
  
  

  

  private generateToken(userId: string): string {
    return jwt.sign({ userId}, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    });
  }

  

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}