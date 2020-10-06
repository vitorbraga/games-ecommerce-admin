import { Category } from '../category/model';
import { Picture } from '../pictures/model';

export enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export interface Product {
    id: string;
    title: string;
    description: string;
    discount: number | null;
    quantityInStock: number;
    tags: string;
    status: string;
    price: number;
    rating: number;
    category: Category;
    reviews: Review[];
    pictures: Picture[];
}

export interface Review {
    id: string;
    title: string;
    description: string;
    rating: number;
}

export type GetAllProductsResponse = {
    success: boolean;
    products: Product[];
} | {
    success: false;
    error: string;
};

export type GetProductByIdResponse = {
    success: boolean;
    product: Product;
} | {
    success: false;
    error: string;
};

export type CreateProductResponse = {
    success: boolean;
    product: Product;
} | {
    success: false;
    error: string;
};

export type UpdateProductResponse = CreateProductResponse;

export interface CreateProductBody {
    title: string;
    description: string;
    price: string;
    quantityInStock: number;
    tags: string;
    categoryId: string;
}

export type UpdateProductBody = CreateProductBody;

export interface ChangeProductStatusBody {
    newStatus: ProductStatus;
}

export type ChangeProductStatusResponse = CreateProductResponse;

export type GetPicturesByProductIdResponse = {
    success: boolean;
    pictures: Picture[];
} | {
    success: false;
    error: string;
};

export type UploadPicturesResponse = GetPicturesByProductIdResponse;
