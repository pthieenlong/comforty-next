export interface IShortProductResponse {
  id: string;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  price: number;
  isSale: boolean;
  salePercent: number;
  isVisible: boolean;
  createdAt: Date;
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
