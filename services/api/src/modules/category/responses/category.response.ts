export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  bannerImage: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface UpdateCategoryResponse {
  id: string;
  name: string;
  slug: string;
}
