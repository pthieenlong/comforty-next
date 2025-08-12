export interface IShortProductResponse {
  id: string;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  price: number;
  isSale: boolean;
  salePercent: number;
  rating: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt?: Date; // Thêm field này
}
export interface IProductResponse {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  salePercent: number;
  isSale: boolean;
  category: string[];
  rating: number;
  isVisible: boolean;
  shortDesc: string;
  longDesc: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  isVisible: boolean;
}
export interface ICreateCategoryRequest {
  name: string;
  slug: string;
  isVisible: boolean;
}

export interface IUpdateCategoryRequest {
  name?: string;
  slug?: string;
  isVisible?: boolean;
}

export interface ICategoryApiResponse {
  success: boolean;
  message: string;
  data: ICategory[];
  httpCode: number;
}

export interface ICreateProductRequest {
  title: string;
  price: number;
  categories: string[];
  images?: string[];
  salePercent?: number;
  isSale?: boolean;
  rating?: number;
  isVisible?: boolean;
  shortDesc?: string;
  longDesc?: string;
}

export interface IProductApiResponse {
  success: boolean;
  message: string;
  data?: IProductResponse;
  httpCode: number;
}
