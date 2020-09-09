import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import * as Model from '../../../modules/products/model';
import { FetchStatus, FetchStatusEnum, serverBaseUrl } from '../../../utils/api-helper';
import * as ProductApi from '../../../modules/products/api';
import * as PictureApi from '../../../modules/pictures/api';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { ConfirmationDialog } from '../../../widgets/confirmation-dialog';
import * as PictureModel from '../../../modules/pictures/model';

import * as theme from './pictures-dialog.scss';

interface Props {
    authToken: string;
    product: Model.Product;
    open: boolean;
    onClose: () => void;
}

interface State {
    fetchStatus: FetchStatus;
    pictureUploadStatus: FetchStatus;
    currentPictures: PictureModel.Picture[];
    pictureFiles: FileList | null;
    deleteDialogOpen: PictureModel.Picture | null;
}

export class PicturesDialog extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        pictureUploadStatus: FetchStatusEnum.initial,
        currentPictures: [],
        pictureFiles: null,
        deleteDialogOpen: null
    };

    public componentDidMount() {
        this.fetchCurrentPictures();
    }

    private fetchCurrentPictures() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const pictures = await ProductApi.getPicturesByProductId(this.props.product.id);
                this.setState({ fetchStatus: FetchStatusEnum.success, currentPictures: pictures });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure });
            }
        });
    }

    private renderFetchStatus() {
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed fetching current product pictures." />;
        }

        return null;
    }

    private generatePictureURL(fileName: string) {
        return `${serverBaseUrl}/public/product-pictures/${fileName}`;
    }

    private handleOpenDeleteDialog = (picture: PictureModel.Picture) => () => {
        this.setState({ deleteDialogOpen: picture });
    }

    private handleCloseDeleteDialog = () => {
        this.setState({ deleteDialogOpen: null });
    }

    private handleConfirmDelete = async () => {
        const { deleteDialogOpen: picture } = this.state;

        if (picture) {
            try {
                // TODO loading and error
                await PictureApi.deletePicture(this.props.authToken, picture.id);
                this.fetchCurrentPictures();
            } catch (error) {
                console.log('error');
            }
        }
    }

    private renderDeleteDialog() {
        const { deleteDialogOpen: picture } = this.state;

        if (picture) {
            return (
                <ConfirmationDialog
                    open={!!picture}
                    onClose={this.handleCloseDeleteDialog}
                    onConfirm={this.handleConfirmDelete}
                >
                    Are you sure you want to remove the picture <b>{picture.filename}</b>?
                </ConfirmationDialog>
            );
        }
    }

    private renderCurrentPictures() {
        const { currentPictures } = this.state;

        return (
            <div className={theme.currentPicturesWrapper}>
                <Typography component="h6" variant="h6">
                    Current pictures
                </Typography>
                {this.renderFetchStatus()}
                <div className={theme.currentPicturesWrapper}>
                    {currentPictures.length === 0
                        ? <div>Product has no current pictures.</div>
                        : <div className={theme.pictureItemsWrapper}>
                            {currentPictures.map((picture, index) => {
                                const pictureUrl = this.generatePictureURL(picture.filename);

                                return (
                                    <div className={theme.pictureItem} key={`picture-item-${index}`}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <a href={pictureUrl} target="_blank">
                                                    <img src={pictureUrl} width="150" height="150" title={picture.filename} />
                                                </a>
                                            </CardContent>
                                            <CardActions>
                                                <div className={theme.actionsWrapper}>
                                                    <IconButton
                                                        title="Delete picture"
                                                        size="small"
                                                        color="inherit"
                                                        onClick={this.handleOpenDeleteDialog(picture)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>
        );
    }

    private handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { authToken, product } = this.props;
        const { pictureFiles } = this.state;

        // TODO add loading, error message
        if (pictureFiles) {
            const formData = new FormData();
            for (const pictureFile of pictureFiles) {
                formData.append('pictures', pictureFile);
            }

            const pictures = await ProductApi.uploadProductPictures(authToken, product.id, formData);
            this.setState({ currentPictures: pictures, pictureFiles: null });
        } else {
            console.log('No files.');
        }
    }

    private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pictureFiles: event.target.files });
    }

    private renderPictureUploadStatus() {
        const { fetchStatus } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingWrapper}><CircularProgress /></div>;
        } else if (fetchStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed uploading product pictures." />;
        }

        return null;
    }

    private renderFormUploadPictures() {
        return (
            <div className={theme.formUploadWrapper}>
                <Typography component="h6" variant="h6">
                    Upload pictures
                </Typography>
                {this.renderPictureUploadStatus()}
                <div className={theme.inputContainer}>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className={theme.fileInputWrapper}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                <input
                                    type="file"
                                    name="pictures"
                                    className={theme.fileInput}
                                    accept="image/x-png,image/jpeg,image/jpg"
                                    onChange={this.handleFileChange}
                                    multiple />
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '10px' }}
                                disabled={this.state.pictureFiles === null}
                            >
                                Upload
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    public render() {
        const { open, onClose } = this.props;

        return (
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                onClose={onClose}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Pictures manager</DialogTitle>
                <DialogContent>
                    <div className={theme.dialogContentWrapper}>
                        {this.renderCurrentPictures()}
                        <Divider />
                        {this.renderFormUploadPictures()}
                        {this.renderDeleteDialog()}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}
