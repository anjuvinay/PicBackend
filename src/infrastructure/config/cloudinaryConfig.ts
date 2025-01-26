import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
   cloud_name: 'decsdyzt1',
  api_key: '155131951395924',
  api_secret: 'puvhj3i9HaTSzTUpBcL2uJi7GwA',
});

export default cloudinary;
