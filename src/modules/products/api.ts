import { serverBaseUrl, headersBuilder } from '../../utils/api-helper';
import * as Model from './model';
import { errorMapper } from '../../utils/messages-mapper';

export const getAllProducts = async (): Promise<Model.Product[]> => {
    const response: Response = await fetch(`${serverBaseUrl}/products`);
    const allProductsResponse: Model.GetAllProductsResponse = await response.json();

    if ('error' in allProductsResponse) {
        throw new Error(errorMapper[allProductsResponse.error]);
    } else {
        return allProductsResponse.products;
    }
};

export const getProductById = async (productId: number): Promise<Model.Product> => {
    const response: Response = await fetch(`${serverBaseUrl}/products/${productId}`);
    const productResponse: Model.GetProductByIdResponse = await response.json();

    if ('error' in productResponse) {
        throw new Error(errorMapper[productResponse.error]);
    } else {
        return productResponse.product;
    }
};

export const createProduct = async (authToken: string, productBody: Model.CreateProductBody): Promise<Model.Product> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'POST',
        body: JSON.stringify(productBody)
    };

    const response: Response = await fetch(`${serverBaseUrl}/products`, options);
    const createProductResponse: Model.CreateProductResponse = await response.json();

    if ('error' in createProductResponse) {
        throw new Error(errorMapper[createProductResponse.error]);
    } else {
        return createProductResponse.product;
    }
};

export const updateProduct = async (authToken: string, productId: number, productBody: Model.UpdateProductBody): Promise<Model.Product> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'PUT',
        body: JSON.stringify(productBody)
    };

    const response: Response = await fetch(`${serverBaseUrl}/products/${productId}`, options);
    const updateProductResponse: Model.UpdateProductResponse = await response.json();

    if ('error' in updateProductResponse) {
        throw new Error(errorMapper[updateProductResponse.error]);
    } else {
        return updateProductResponse.product;
    }
};

export const deleteProduct = async (authToken: string, productId: number): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'DELETE'
    };

    const response: Response = await fetch(`${serverBaseUrl}/products/${productId}`, options);
    const deleteProductResponse: Model.UpdateProductResponse = await response.json();

    if ('error' in deleteProductResponse) {
        throw new Error(errorMapper[deleteProductResponse.error]);
    }
};
