export interface Category {
    id: string;
    key: string;
    label: string;
    subCategories: Category[];
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

export type DeleteCategoryResponse = {
    success: boolean;
} | {
    success: false;
    error: string;
};
