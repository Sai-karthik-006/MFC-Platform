export interface ProductVariantResponse {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  isDefault: boolean;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
