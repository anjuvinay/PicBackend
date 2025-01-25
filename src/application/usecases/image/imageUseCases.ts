
import { IImageRepository } from '../../../domain/repositories/interfaces/IImageRepository';
import { ImageEntity } from '../../../domain/entities/ImageEntity';

interface UploadImagesInput {
  id?:String;
  userId: string;       
  filePaths: string[];  
  titles: string[];     
}

export async function uploadImagesUseCase(
  { userId, filePaths, titles }: UploadImagesInput,
  imageRepository: IImageRepository
): Promise<ImageEntity[]> {
  if (!filePaths || filePaths.length === 0) {
    throw new Error('No files provided');
  }
  if (!titles || titles.length !== filePaths.length) {
    throw new Error('Titles array must match the number of files');
  }

  const imagesToStore: ImageEntity[] = filePaths.map((path, idx) => ({
    userId,
    title: titles[idx],
    imagePath: path,
  }));

  const storedImages = await imageRepository.storeImages(imagesToStore);
  return storedImages;
}



export async function getUserImagesUseCase(
  userId: string,
  imageRepository: IImageRepository
): Promise<ImageEntity[]> {
  if (!userId) {
    throw new Error('userId is required');
  }

  return imageRepository.getImagesByUserId(userId);
}


export async function deleteUserImageUseCase(
    Id: string,
    userId: string,
    imageRepository: IImageRepository
  ): Promise<void> {
    if (!Id || !userId) {
      throw new Error('imageId and userId are required');
    }
    await imageRepository.deleteImage(Id, userId);
  }
  




  export async function editImageUseCase(
    id: string,
    userId: string,
    title: string,
    file: Express.Multer.File | null,
    imageRepository: IImageRepository
  ): Promise<ImageEntity> {
    if (!id || !userId) {
      throw new Error('Invalid input for editing image');
    }
  
    let newImagePath: string | undefined;
    if (file) {
      newImagePath = `uploads/${file.filename}`; 
    }
  
    const updatedImage = await imageRepository.updateImage(id, userId, title, newImagePath);
    if (!updatedImage) {
      throw new Error('Image not found or not authorized to update');
    }
  
    return updatedImage;
  }
  




  export async function updateOrderUseCase(
    reorderedImages: ImageEntity[],
    userId: string,
    imageRepository: IImageRepository
  ): Promise<void> {
    if (!reorderedImages || reorderedImages.length === 0) {
      throw new Error("No images provided for reordering");
    }
  
    console.log("Authenticated UserId:", userId);
    console.log("Reordered Images:", reorderedImages);
  
    // Check if all images belong to the authenticated user
    for (const image of reorderedImages) {
      console.log(`Validating image ${image.id}: userId=${image.userId}`);
      if (image.userId !== userId) {
        console.error(`Unauthorized operation for image: ${image.id}`);
        throw new Error("Unauthorized operation");
      }
    }
  
    // Proceed to update the image order in the repository
    await imageRepository.updateImageOrder(reorderedImages);
  }
  
  