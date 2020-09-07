import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as Model from '../../../modules/products/model';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import * as ProductApi from '../../../modules/products/api';

import * as theme from './product-list.scss';

interface Props {
    authToken: string;
}

interface State {
    loadingProducts: FetchStatus;
    products: Model.Product[];
    deleteDialogOpen: Model.Product | null;
    snackbarMessage: string | null;
}

export class ProductList extends React.PureComponent<Props, State> {
    public state: State = {
        loadingProducts: FetchStatusEnum.initial,
        products: [],
        deleteDialogOpen: null,
        snackbarMessage: null
    };

    private loadProductList() {
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

    public componentDidMount() {
        this.loadProductList();
    }

    private handleClickDelete = (product: Model.Product) => () => {
        this.setState({ deleteDialogOpen: product });
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
                            <TableCell align="right">Actions</TableCell>
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
                                <TableCell align="right">
                                    <div className={theme.actionsWrapper}>
                                        <IconButton
                                            title="Manage pictures"
                                            size="small"
                                            color="inherit"
                                            onClick={() => console.log(121)}
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                        {product.status === Model.ProductStatus.AVAILABLE
                                            ? <IconButton
                                                title="Make not available"
                                                size="small"
                                                color="inherit"
                                                onClick={() => console.log(121)}
                                            >
                                                <BlockIcon />
                                            </IconButton>
                                            : <IconButton
                                                title="Make available"
                                                size="small"
                                                color="inherit"
                                                onClick={() => console.log(121)}
                                            >
                                                <CheckCircleOutlineIcon />
                                            </IconButton>
                                        }
                                        <IconButton
                                            title="Delete product"
                                            size="small"
                                            color="inherit"
                                            onClick={this.handleClickDelete(product)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
    }

    private handleCloseDeleteDialog = () => {
        this.setState({ deleteDialogOpen: null });
    }

    private handleConfirmDelete = async () => {
        const { deleteDialogOpen: product } = this.state;
        if (product !== null) {
            try {
                await ProductApi.deleteProduct(this.props.authToken, product.id);
                this.setState({ deleteDialogOpen: null }, () => {
                    this.loadProductList();
                });
            } catch (error) {
                this.setState({ snackbarMessage: error.message });
            }
        }
    }

    private renderDeleteDialog() {
        const { deleteDialogOpen: product } = this.state;

        if (product) {
            return (
                <Dialog
                    open={!!product}
                    onClose={this.handleCloseDeleteDialog}
                >
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove the product <b>{product.title}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDeleteDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleConfirmDelete} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }

    private handleCloseSnackbar = () => {
        this.setState({ snackbarMessage: null });
    }

    private renderSnackbar() {
        const { snackbarMessage } = this.state;

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={this.handleCloseSnackbar}
                message={snackbarMessage}
            />
        );
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    List of products
                </Typography>
                {this.renderProductsTable()}
                {this.renderDeleteDialog()}
                {this.renderSnackbar()}
            </div>
        );
    }
}
