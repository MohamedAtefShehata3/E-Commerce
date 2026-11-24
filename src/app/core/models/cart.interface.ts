export interface CartData {
  _id: string;
  cartOwner: string;
  products: Product2[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface Product2 {
  _id: string;
  count: number;
  product: Product;
  price: number;
}

export interface Product {
  subcategory: Subcategory[];
  _id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverade: number;
  id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
