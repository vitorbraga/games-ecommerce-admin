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
    status: string;
    price: number; // 5000 represents $50.00
    discount: number | null;
    rating: number;
    quantityInStock: number;
    tags: string; // because of simplicity and sqlite, using a comma-separated list as tags
    createdAt: string;
    updatedAt: string;
    reviews?: Review[];
    pictures?: Picture[];
    category: Category;
    userProducts?: UserProduct[];
}

export interface Review {
    id: string;
    rating: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProduct { // TODO
    id: string;
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
