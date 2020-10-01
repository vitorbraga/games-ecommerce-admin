import { serverBaseUrl, headersBuilder } from '../../utils/api-helper';
import * as Model from './model';
import { errorMapper } from '../../utils/messages-mapper';

export const getFullCategoryTrees = async (): Promise<Model.Category[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/categories`);
    const fullCategoriesResponse: Model.GetFullCategoriesTreeResponse = await response.json();

    if ('error' in fullCategoriesResponse) {
        throw new Error(errorMapper[fullCategoriesResponse.error]);
    } else {
        return fullCategoriesResponse.categories;
    }
};

export const getSubCategoriesByParentId = async (parentId: string | null): Promise<Model.Category[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/categories/parent/${parentId || 'none'}`);
    const subCategoriesResponse: Model.GetSubCategoriesByParentIdResponse = await response.json();

    if ('error' in subCategoriesResponse) {
        throw new Error(errorMapper[subCategoriesResponse.error]);
    } else {
        return subCategoriesResponse.subCategories;
    }
};

export const createCategory = async (authToken: string, parentId: string, key: string, label: string): Promise<Model.Category> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'POST',
        body: JSON.stringify({ parentId, key, label })
    };

    const response: Response = await fetch(`${serverBaseUrl}/categories`, options);
    const createCategoryResponse: Model.CreateCategoryResponse = await response.json();

    if ('error' in createCategoryResponse) {
        throw new Error(errorMapper[createCategoryResponse.error]);
    } else {
        return createCategoryResponse.category;
    }
};

export const deleteSubCategories = async (authToken: string, parentId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'DELETE'
    };

    const response: Response = await fetch(`${serverBaseUrl}/categories/sub-categories/${parentId}`, options);
    const deleteCategoryResponse: Model.DeleteCategoryResponse = await response.json();

    if ('error' in deleteCategoryResponse) {
        throw new Error(errorMapper[deleteCategoryResponse.error]);
    }
};
