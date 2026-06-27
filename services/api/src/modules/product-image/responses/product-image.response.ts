export interface ProductImageResponse {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}
