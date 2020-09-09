import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import * as Model from '../../../modules/products/model';
import { FetchStatus, FetchStatusEnum, serverBaseUrl } from '../../../utils/api-helper';
import * as ProductApi from '../../../modules/products/api';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { CircularProgress } from '@material-ui/core';

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
    currentPictures: Model.Picture[];
    pictureFiles: FileList | null;
}

export class PicturesDialog extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        pictureUploadStatus: FetchStatusEnum.initial,
        currentPictures: [],
        pictureFiles: null
    };

    public componentDidMount() {
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

    private renderCurrentPictures() {
        const { currentPictures } = this.state;

        return (
            <div>
                <Typography component="h6" variant="h6">
                    Current pictures
                </Typography>
                {this.renderFetchStatus()}
                <div>
                    {currentPictures.length === 0
                        ? <div>Product has no current pictures.</div>
                        : <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            {currentPictures.map((picture, index) => {
                                const pictureUrl = `${serverBaseUrl}/public/product-pictures/${picture.filename}`;

                                return (
                                    <Card variant="outlined" key={`picture-card-${index}`}>
                                        <CardContent>
                                            <img src={pictureUrl} width="150" height="150" />
                                        </CardContent>
                                    </Card>
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

        if (pictureFiles) {
            const formData = new FormData();
            for (const pictureFile of pictureFiles) {
                formData.append('imgCollection', pictureFile);
            }

            const pictures = await ProductApi.uploadProductPictures(authToken, product.id, formData);
            this.setState({ currentPictures: pictures });
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
                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="form-group">
                            <input type="file" name="imgCollection" onChange={this.handleFileChange} multiple />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Upload</button>
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
                <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle>
                <DialogContent>
                    {this.renderCurrentPictures()}
                    {this.renderFormUploadPictures()}
                </DialogContent>
            </Dialog>
        );
    }
}
