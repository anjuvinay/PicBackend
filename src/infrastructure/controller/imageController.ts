
import { Request, Response } from 'express';
import { ImageRepository } from '../../domain/repositories/ImageRepository';
import { uploadImagesUseCase, getUserImagesUseCase, deleteUserImageUseCase, editImageUseCase, updateOrderUseCase } from '../../application/usecases/image/imageUseCases';
import { ImageEntity } from '../../domain/entities/ImageEntity';
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';


dotenv.config();

const imageRepository = new ImageRepository();




const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // const userId = req.user?.userId;
    const userId = req.user!.userId; 

    // if (!userId) {
    //   res.status(401).json({ success: false, message: 'Unauthorized' });
    //   return;
    // }

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
      res.status(400).json({ success: false, message: 'Titles do not match the number of images.' });
      return;
    }

    
    const filePaths: string[] = files.map((file: any) => file.path);

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
};








const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // const userId = req.user?.userId;
    const userId = req.user!.userId;

    // if (!userId) {
    //   res.status(401).json({ success: false, message: 'Unauthorized' });
    //   return;
    // }

    const images = await getUserImagesUseCase(userId, imageRepository);

    
    const fullImagePaths = images.map((image) => ({
      id: image.id,
      title: image.title,
      url: image.imagePath, 
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
    // const userId = req.user?.userId;
    const userId = req.user!.userId;
    const { id } = req.body;

    // if (!userId) {
    //   res.status(401).json({ success: false, message: "Unauthorized" });
    //   return;
    // }

    if (!id) {
      res.status(400).json({ success: false, message: "Image ID is required" });
      return;
    }

    
    const image = await imageRepository.getImageById(id, userId);
    if (!image) {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }

    
    const publicIdMatch = image.imagePath.match(/\/([^/]+)\.[a-z]+$/i);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;

    if (!publicId) {
      res.status(400).json({ success: false, message: "Invalid image URL or public ID" });
      return;
    }

    
    await cloudinary.uploader.destroy(publicId);

  
    await imageRepository.deleteImage(id, userId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Image deletion failed.",
    });
  }
};






const editImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // const userId = req.user?.userId;
    const userId = req.user!.userId;
    const { id, title } = req.body;
    const file = req.file as Express.Multer.File | undefined; 

    // if (!userId) {
    //   res.status(401).json({ success: false, message: "Unauthorized" });
    //   return;
    // }

    if (!id) {
      res.status(400).json({ success: false, message: "Image ID is required" });
      return;
    }

    
    const image = await imageRepository.getImageById(id, userId);
    if (!image) {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }

    let updatedImagePath = image.imagePath;

    
    if (file) {
      const publicIdMatch = image.imagePath.match(/\/([^/]+)\.[a-z]+$/i);
      const publicId = publicIdMatch ? publicIdMatch[1] : null;

      if (publicId) {
        
        await cloudinary.uploader.destroy(publicId);
      }

    
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "picStack",
      });
      updatedImagePath = uploadResult.secure_url;
    }

    
    const updatedImage = await imageRepository.updateImage(
      id,
      userId,
      title,
      updatedImagePath
    );

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error: any) {
    console.error("Error editing image:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Image update failed.",
    });
  }
};






  const reorderImages = async (req: Request, res: Response): Promise<void> => {
    console.log("Reached reorder images controller")
    try {
      // const userId = req.user?.userId; 
      const userId = req.user!.userId;
      const { reorderedImages } = req.body;
  
      // if (!userId) {
      //   res.status(401).json({ success: false, message: "Unauthorized" });
      //   return;
      // }
  
      if (!reorderedImages || !Array.isArray(reorderedImages)) {
        res.status(400).json({ success: false, message: "Invalid input data" });
        return;
      }
  
      
      const imagesWithUserId = reorderedImages.map((image: ImageEntity) => ({
        ...image,
        userId, 
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