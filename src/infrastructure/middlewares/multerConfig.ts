
// import multer from "multer";
// import path from "path";





// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });


// export const uploadFields = upload.any();




import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'decsdyzt1',
  api_key: '155131951395924',
  api_secret: 'puvhj3i9HaTSzTUpBcL2uJi7GwA',
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'picStack', // Specify a default folder (optional)
      upload_preset: 'picStack', // Use the upload preset
      public_id: `${Date.now()}-${file.originalname}`, // Unique ID for the image
    };
  },
});

// Multer instance
export const upload = multer({ storage });
export const uploadFields = upload.any();
