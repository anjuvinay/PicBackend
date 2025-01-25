
import { Request, Response } from 'express';
import { ImageRepository } from '../../domain/repositories/ImageRepository';
import { uploadImagesUseCase, getUserImagesUseCase, deleteUserImageUseCase, editImageUseCase, updateOrderUseCase } from '../../application/usecases/image/imageUseCases';
import { ImageEntity } from '../../domain/entities/ImageEntity';
import dotenv from "dotenv";

dotenv.config();

const imageRepository = new ImageRepository();




  const uploadImages = async (req: Request, res: Response): Promise<void> =>{
    console.log("Reached Controller")
  try {
    const userId = req.user?.userId;
    console.log("UserId",userId)
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No images uploaded.' });
      return;
    }

    let titles = req.body.titles;
    if (!titles) {
      titles = [];
    } else if (!Array.isArray(titles)) {
      titles = [titles];
    }

    if (titles.length !== files.length) {
      res.status(400).json({ success: false, message: 'Titles do not match number of images.' });
      return;
    }

    const filePaths: string[] = files.map((file) => `uploads/${file.filename}`);

    const storedImages = await uploadImagesUseCase(
      { userId, filePaths, titles },
      imageRepository
    );

    res.status(200).json({
      success: true,
      data: storedImages,
    });
  } catch (error: any) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed.',
    });
  }
}







const getImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId; 
  
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
  
      const images = await getUserImagesUseCase(userId, imageRepository);
      console.log("Image array", images)
  
      const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:8000'; 
      const fullImagePaths = images.map((image) => ({
        id:image.id,
        title: image.title,
        url: `${serverBaseUrl}/${image.imagePath}`, 
        
      }));
  
      
      res.status(200).json({
        success: true,
        data: fullImagePaths,
      });
    } catch (error: any) {
      console.error('Error fetching images:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching images.',
      });
    }
  };



  const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { Id } = req.body;
      console.log("imageId or image path", Id)
  
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
  
      await deleteUserImageUseCase(Id, userId, imageRepository);
  
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Image deletion failed.',
      });
    }
  };



  const editImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id, title } = req.body;
      const file = (req.file as Express.Multer.File) || null;
  
      if (!userId || !id) {
        res.status(400).json({ success: false, message: 'Invalid request data' });
        return;
      }
  
      const updatedImage = await editImageUseCase(id, userId, title, file, imageRepository);
  
      res.status(200).json({
        success: true,
        message: 'Image updated successfully',
        data: updatedImage,
      });
    } catch (error: any) {
      console.error('Error editing image:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Image update failed',
      });
    }
  };





  const reorderImages = async (req: Request, res: Response): Promise<void> => {
    console.log("Reached reorder images controller")
    try {
      const userId = req.user?.userId; // Authenticated user's ID
      const { reorderedImages } = req.body;
  
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
  
      if (!reorderedImages || !Array.isArray(reorderedImages)) {
        res.status(400).json({ success: false, message: "Invalid input data" });
        return;
      }
  
      // Override userId for all images to ensure consistency
      const imagesWithUserId = reorderedImages.map((image: ImageEntity) => ({
        ...image,
        userId, // Enforce the correct userId
      }));
  
      await updateOrderUseCase(imagesWithUserId, userId, imageRepository);
  
      res.status(200).json({
        success: true,
        message: "Order updated successfully!",
      });
    } catch (error: any) {
      console.error("Error reordering images:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Image reordering failed.",
      });
    }
  };
  
  
  
  
  






export default {uploadImages,
                getImages,
                deleteImage,
                editImage,
                reorderImages,
   
    
}