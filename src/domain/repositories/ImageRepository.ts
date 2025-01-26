
import { IImageRepository } from '../../domain/repositories/interfaces/IImageRepository';
import { ImageEntity } from '../../domain/entities/ImageEntity';
import ImageModel from '../../infrastructure/models/ImageModel';

export class ImageRepository implements IImageRepository {
  public async storeImages(images: ImageEntity[]): Promise<ImageEntity[]> {
    const insertedDocs = await ImageModel.insertMany(images);
    
    return insertedDocs.map((doc) => ({
      userId: doc.userId,
      title: doc.title,
      imagePath: doc.imagePath,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  public async getImagesByUserId(userId: string): Promise<ImageEntity[]> {
    const docs = await ImageModel.find({ userId }).sort({ order: 1 }).exec();
    return docs.map((doc) => ({
      id:doc.id,
      userId: doc.userId,
      title: doc.title,
      imagePath: doc.imagePath,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }


  public async deleteImage(Id: string, userId: string): Promise<void> {
    const result = await ImageModel.deleteOne({_id:Id, userId }).exec();
  
    if (result.deletedCount === 0) {
      throw new Error('Image not found or not authorized to delete');
    }
  }



  public async updateImage(
    id: string,
    userId: string,
    title?: string,
    imagePath?: string
  ): Promise<ImageEntity | null> {
    const updateData: Partial<ImageEntity> = {};
    if (title) updateData.title = title;
    if (imagePath) updateData.imagePath = imagePath;
  
    const updatedDoc = await ImageModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true } // Return the updated document
    ).exec();
  
    return updatedDoc
      ? {
          id: (updatedDoc._id as any).toString(), // Explicitly cast `_id` to string
          userId: updatedDoc.userId,
          title: updatedDoc.title,
          imagePath: updatedDoc.imagePath,
          createdAt: updatedDoc.createdAt,
          updatedAt: updatedDoc.updatedAt,
        }
      : null;
  }
  
  
  

  


  public async updateImageOrder(images: ImageEntity[]): Promise<void> {
    const bulkOperations = images.map((image, index) => ({
      updateOne: {
        filter: { _id: image.id, userId: image.userId },
        update: { $set: { order: index + 1 } }, // Use `index + 1` for new order
      },
    }));
  
    await ImageModel.bulkWrite(bulkOperations);
  }



  public async getImageById(id: string, userId: string): Promise<ImageEntity | null> {
    return ImageModel.findOne({ _id: id, userId }).exec();
  }
  



  
}



