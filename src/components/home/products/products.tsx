import * as React from 'react';
import { ProductList } from './product-list';
import { CreateProduct } from './create-product';

import * as theme from './products.scss';

interface Props {
    authToken: string;
}

export class Products extends React.PureComponent<Props, never> {
    public render() {
        return (
            <div className={theme.contentBox}>
                <div className={theme.productList}>
                    <ProductList />
                </div>
                <div className={theme.createProduct}>
                    <CreateProduct authToken={this.props.authToken} />
                </div>
            </div>
        );
    }
}
