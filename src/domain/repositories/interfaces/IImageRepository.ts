
import { ImageEntity } from '../../entities/ImageEntity';

export interface IImageRepository {
  storeImages(images: ImageEntity[]): Promise<ImageEntity[]>;
  getImagesByUserId(userId: string): Promise<ImageEntity[]>;
  deleteImage(Id: string, userId: string): Promise<void>;
  updateImage(id: string, userId: string, title?: string, imagePath?: string): Promise<ImageEntity | null>;
  updateImageOrder(images: ImageEntity[]): Promise<void>;
  
}
