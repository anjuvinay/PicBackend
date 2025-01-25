
import { IUserRepository } from './interfaces/IUserRepository';
import userModel, { UserDocument } from '../../infrastructure/models/UserModel';
import { User } from '../../domain/entities/User';
import mongoose from 'mongoose';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const userDoc = await userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async createUser(user: User): Promise<User> {
    const newUser = new userModel({
      ...user,
      _id: new mongoose.Types.ObjectId(), 
    });
    const savedUser = await newUser.save();
    return this.toDomain(savedUser);
  }



  async updateUser(id: string, userDetails: Partial<User>): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const updatedUser = await userModel.findByIdAndUpdate(id, userDetails, {
      new: true, 
    }).exec();

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  


  


  
  private toDomain(userDoc: UserDocument): User {
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      password: userDoc.password,
     
    };
  }
}
