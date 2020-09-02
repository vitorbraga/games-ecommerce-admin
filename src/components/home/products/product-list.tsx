import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as Model from '../../../modules/products/model';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import * as ProductApi from '../../../modules/products/api';

import * as theme from './product-list.scss';

interface State {
    loadingProducts: FetchStatus;
    products: Model.Product[];
}

export class ProductList extends React.PureComponent<{}, State> {
    public state: State = {
        loadingProducts: FetchStatusEnum.initial,
        products: []
    };

    public componentDidMount() {
        this.setState({ loadingProducts: FetchStatusEnum.loading }, async () => {
            try {
                const products = await ProductApi.getAllProducts();
                this.setState({ products, loadingProducts: FetchStatusEnum.success });
            } catch (error) {
                console.log(error);
                this.setState({ loadingProducts: FetchStatusEnum.failure });
            }
        });
    }

    private renderProductsTable() {
        const { products } = this.state;

        if (products.length === 0) {
            return <div>No products</div>;
        } else {
            return (
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity Stock</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell component="th" scope="row">{product.id}</TableCell>
                                <TableCell align="right">{product.title}</TableCell>
                                <TableCell align="right">{product.description}</TableCell>
                                <TableCell align="right">{product.price}</TableCell>
                                <TableCell align="right">{product.quantityInStock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    List of products
                </Typography>
                {this.renderProductsTable()}
            </div>
        );
    }
}
