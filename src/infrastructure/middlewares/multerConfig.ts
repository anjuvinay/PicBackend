
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: 'decsdyzt1',
  api_key: '155131951395924',
  api_secret: 'puvhj3i9HaTSzTUpBcL2uJi7GwA',
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'picStack', 
      upload_preset: 'picStack', 
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});


export const upload = multer({ storage });
export const uploadFields = upload.any();
