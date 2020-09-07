import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CategorySelector } from '../categories/category-selector';
import { createProduct } from '../../../modules/products/api';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { CreateProductBody } from '../../../modules/products/model';
import { ResultMessageBox } from '../../../widgets/result-message-box';

import * as theme from './create-product.scss';

interface Props {
    authToken: string;
}

interface State {
    productBody: {
        title: string;
        description: string;
        price: string;
        quantityInStock: string;
        tags: string;
        categoryId: number;
    };
    submitStatus: FetchStatus;
}

export class CreateProduct extends React.PureComponent<Props, State> {
    private static emptyProductBody = {
        title: '',
        description: '',
        price: '',
        quantityInStock: '',
        tags: '',
        categoryId: 0
    };

    public state: State = {
        productBody: { ...CreateProduct.emptyProductBody },
        submitStatus: FetchStatusEnum.initial
    };

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        this.setState((prevState) => ({
            productBody: {
                ...prevState.productBody,
                [field]: event.target.value
            }
        } as Pick<State, any>));
    }

    private buildCreateProductBody = (): CreateProductBody => {
        const { productBody } = this.state;

        return {
            ...productBody,
            quantityInStock: parseInt(productBody.quantityInStock, 10),
            categoryId: productBody.categoryId.toString()
        };
    }

    private handleSubmit = () => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                await createProduct(this.props.authToken, this.buildCreateProductBody());
                this.setState({
                    submitStatus: FetchStatusEnum.success,
                    productBody: { ...CreateProduct.emptyProductBody }
                });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleSelectCategory = (categoryId: number) => {
        this.setState({ productBody: { ...this.state.productBody, categoryId }});
    }

    private renderSubmitStatus() {
        const { submitStatus } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed creating category. Please try again." />;
        } else if (submitStatus === FetchStatusEnum.success) {
            return <ResultMessageBox type="success" message="Product created successfully." />;
        }

        return null;
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    Create product
                </Typography>
                {this.renderSubmitStatus()}
                <div className={theme.formWrapper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Title"
                                onChange={this.handleInputChange('title')}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Description"
                                onChange={this.handleInputChange('description')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Price"
                                onChange={this.handleInputChange('price')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Quantity in Stock"
                                onChange={this.handleInputChange('quantityInStock')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Tags"
                                onChange={this.handleInputChange('tags')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div><b>Category id: {this.state.productBody.categoryId}</b></div>
                                    <CategorySelector
                                        selectedCategoryId={this.state.productBody.categoryId}
                                        onSelectCategory={this.handleSelectCategory}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <div className={theme.submitWrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
