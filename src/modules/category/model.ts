import { Product } from '../products/model';

export interface Category {
    id: number;
    key: string;
    label: string;
    createdAt: string;
    updatedAt: string;
    subCategories?: Category[];
    parent?: Category | null;
    products?: Product[]; // FIXME
}

export type GetFullCategoriesTreeResponse = {
    success: boolean;
    categories: Category[];
} | {
    success: false;
    error: string;
};

export type GetSubCategoriesByParentIdResponse = {
    success: boolean;
    subCategories: Category[];
} | {
    success: false;
    error: string;
};

export type CreateCategoryResponse = {
    success: boolean;
    category: Category;
} | {
    success: false;
    error: string;
};
