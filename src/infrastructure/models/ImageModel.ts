
import mongoose, { Document, Schema } from 'mongoose';

export interface ImageDocument extends Document {
  //id?:string;
  userId: string;
  title: string;
  imagePath: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<ImageDocument>(
  {
    //id:{type:String},
    userId: { type: String, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ImageDocument>('Image', ImageSchema);
