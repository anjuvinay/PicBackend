
import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../domain/entities/User';

export interface UserDocument extends Document, Omit<User, 'id'> {
  _id: string;
}


const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true,
    validate: {
      validator: (value: string) => /[a-zA-Z]/.test(value),
      message: 'Invalid Name entry'
    }
  },
  
  email: { type: String, required: true, unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  },

  phone: { type: String },

  password: { type: String, required:true },
  
  
});

const userModel = mongoose.model<UserDocument>('users', userSchema);
export default userModel;
