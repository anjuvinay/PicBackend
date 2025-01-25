export interface ImageEntity {
    id?: string;
    userId: string;
    title: string;
    imagePath: string;
    createdAt?: Date;
    updatedAt?: Date;
  }