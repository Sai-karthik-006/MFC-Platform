export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailImage: string | null;
  isVeg: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: CategorySummary;
  createdAt: Date;
  updatedAt: Date;
}
