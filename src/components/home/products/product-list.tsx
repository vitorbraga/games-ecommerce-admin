import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as Model from '../../../modules/products/model';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CustomSnackbar, SnackbarType, SnackbarTypeEnum } from '../../../widgets/custom-snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import * as ProductApi from '../../../modules/products/api';
import { formatPrice } from '../../../utils/common-helper';
import { PicturesDialog } from './pictures-dialog';
import { ConfirmationDialog } from '../../../widgets/confirmation-dialog';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { UpdateProductDialog } from './update-product-dialog';

import * as theme from './product-list.scss';

interface Props {
    authToken: string;
}

interface State {
    fetchStatus: FetchStatus;
    products: Model.Product[];
    deleteDialogOpen: Model.Product | null;
    picturesDialogOpen: Model.Product | null;
    updateProductDialogOpen: Model.Product | null;
    snackbar: {
        message: string;
        type: SnackbarType;
    };
}

export class ProductList extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        products: [],
        deleteDialogOpen: null,
        picturesDialogOpen: null,
        updateProductDialogOpen: null,
        snackbar: {
            message: '',
            type: SnackbarTypeEnum.info
        }
    };

    private loadProductList = () => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const products = await ProductApi.getAllProducts();
                this.setState({ products, fetchStatus: FetchStatusEnum.success });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    public componentDidMount() {
        this.loadProductList();
    }

    private handleOpenPicturesDialog = (product: Model.Product) => () => {
        this.setState({ picturesDialogOpen: product });
    }

    private handleClickDelete = (product: Model.Product) => () => {
        this.setState({ deleteDialogOpen: product });
    }

    private handleClickUpdate = (product: Model.Product) => () => {
        this.setState({ updateProductDialogOpen: product });
    }

    private handleChangeProductStatus = (productId: string, newStatus: Model.ProductStatus) => async () => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                await ProductApi.changeProductStatus(this.props.authToken, productId, { newStatus });
                this.setState({
                    snackbar: { type: SnackbarTypeEnum.success, message: 'Changed product status successfully.' }
                }, () => {
                    this.loadProductList();
                });
            } catch (error) {
                this.setState({ snackbar: { type: SnackbarTypeEnum.error, message: error.message } });
            }
        });
    }

    private renderProductsTable() {
        const { products, fetchStatus } = this.state;

        if (products.length === 0 && fetchStatus === FetchStatusEnum.initial) {
            return <div>No products.</div>;
        } else if (products.length > 0) {
            return (
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity Stock</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell component="th" scope="row">{product.id}</TableCell>
                                <TableCell align="right">{product.title}</TableCell>
                                <TableCell align="right">{product.description}</TableCell>
                                <TableCell align="right">{formatPrice(product.price)}</TableCell>
                                <TableCell align="right">{product.quantityInStock}</TableCell>
                                <TableCell align="right">{product.status}</TableCell>
                                <TableCell align="right">
                                    <div className={theme.actionsWrapper}>
                                        <IconButton
                                            title="Manage pictures"
                                            size="small"
                                            color="inherit"
                                            onClick={this.handleOpenPicturesDialog(product)}
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                        {product.status === Model.ProductStatus.AVAILABLE
                                            ? <IconButton
                                                title="Make not available"
                                                size="small"
                                                color="inherit"
                                                onClick={this.handleChangeProductStatus(product.id, Model.ProductStatus.NOT_AVAILABLE)}
                                            >
                                                <BlockIcon />
                                            </IconButton>
                                            : <IconButton
                                                title="Make available"
                                                size="small"
                                                color="inherit"
                                                onClick={this.handleChangeProductStatus(product.id, Model.ProductStatus.AVAILABLE)}
                                            >
                                                <CheckCircleOutlineIcon />
                                            </IconButton>
                                        }
                                        <IconButton
                                            title="Edit product"
                                            size="small"
                                            color="inherit"
                                            onClick={this.handleClickUpdate(product)}
                                        >
                                            <EditIcon />
                                        </IconButton>
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
                this.setState({
                    deleteDialogOpen: null,
                    snackbar: { type: SnackbarTypeEnum.success, message: 'Product removed successfully.' }
                }, () => {
                    this.loadProductList();
                });
            } catch (error) {
                this.setState({ snackbar: { type: SnackbarTypeEnum.error, message: error.message } });
            }
        }
    }

    private renderDeleteDialog() {
        const { deleteDialogOpen: product } = this.state;

        if (product) {
            return (
                <ConfirmationDialog
                    open={!!product}
                    onClose={this.handleCloseDeleteDialog}
                    onConfirm={this.handleConfirmDelete}
                >
                    Are you sure you want to remove the product <b>{product.title}</b>?
                </ConfirmationDialog>
            );
        }
    }

    private handleCloseSnackbar = () => {
        this.setState({ snackbar: { type: SnackbarTypeEnum.info, message: '' } });
    }

    private handleResetFetchStatus = () => {
        this.setState({ fetchStatus: FetchStatusEnum.initial });
    }

    private renderStatus() {
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed fetching products." onClose={this.handleResetFetchStatus} />;
        }

        return null;
    }

    private renderSnackbar() {
        const { snackbar: { type, message } } = this.state;

        return (
            <CustomSnackbar
                open={!!message}
                onClose={this.handleCloseSnackbar}
                type={type}
                message={message}
            />
        );
    }

    private handleClosePicturesDialog = () => {
        this.setState({ picturesDialogOpen: null });
    }

    private renderPicturesDialog() {
        const { picturesDialogOpen: product } = this.state;

        if (product) {
            return (
                <PicturesDialog
                    authToken={this.props.authToken}
                    product={product}
                    open={!!product}
                    onClose={this.handleClosePicturesDialog}
                />
            );
        }
    }

    private handleCloseUpdateProductDialog = () => {
        this.setState({ updateProductDialogOpen: null });
    }

    private renderUpdateProductDialog() {
        const { updateProductDialogOpen: product } = this.state;

        if (product) {
            return (
                <UpdateProductDialog
                    authToken={this.props.authToken}
                    product={product}
                    open={!!product}
                    onClose={this.handleCloseUpdateProductDialog}
                    onRefreshList={this.loadProductList}
                />
            );
        }
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    List of products
                </Typography>
                {this.renderStatus()}
                {this.renderProductsTable()}
                {this.renderDeleteDialog()}
                {this.renderSnackbar()}
                {this.renderPicturesDialog()}
                {this.renderUpdateProductDialog()}
            </div>
        );
    }
}
