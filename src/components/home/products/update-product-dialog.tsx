import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import * as Model from '../../../modules/products/model';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { checkEmptyCategoryId } from '../../../utils/validators';
import { CategoryTree } from '../categories/category-tree';
import { updateProduct } from '../../../modules/products/api';
import { LargeDialog } from '../../../widgets/large-dialog';

import * as theme from './update-product-dialog.scss';

interface Props {
    authToken: string;
    product: Model.Product;
    open: boolean;
    onClose: () => void;
    onRefreshList: () => void;
}

interface State {
    updateStatus: FetchStatus;
    initialValues: FormData;
}

interface FormData {
    title: string;
    description: string;
    price: string;
    quantityInStock: string;
    tags: string;
    categoryId: string;
}

export class UpdateProductDialog extends React.PureComponent<Props, State> {
    public state: State = {
        initialValues: this.getInitialValues(),
        updateStatus: FetchStatusEnum.initial
    };

    public getInitialValues(): FormData {
        const { product: { title, description, price, quantityInStock, tags, category } } = this.props;
        return { title, description, price: price.toString(), quantityInStock: quantityInStock.toString(), tags, categoryId: category.id };
    }

    private renderSubmitStatus() {
        const { updateStatus } = this.state;

        if (updateStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (updateStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed updating category. Please try again." />;
        } else if (updateStatus === FetchStatusEnum.success) {
            return <ResultMessageBox type="success" message="Product created successfully." />;
        }

        return null;
    }

    private validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required.'),
        description: Yup.string().required('Description is required.'),
        price: Yup.number().required('Price is required.').typeError('Price must have digits only.'),
        quantityInStock: Yup.number().required('Quantity in Stock is required.').typeError('Quantity in Stock must have digits only.'),
        tags: Yup.string().required('Tags are required.'),
        categoryId: Yup.string().test('category-id', 'You need too blaa', checkEmptyCategoryId)
    });

    private buildUpdateProductBodyFromFormData = (formData: FormData): Model.UpdateProductBody => {
        return {
            ...formData,
            quantityInStock: parseInt(formData.quantityInStock, 10)
        };
    }

    private isSubmitButtonDisabled(): boolean {
        return this.state.updateStatus === FetchStatusEnum.loading;
    }

    private handleSubmit = (values: FormData) => {
        this.setState({ updateStatus: FetchStatusEnum.loading }, async () => {
            try {
                await updateProduct(this.props.authToken, this.props.product.id, this.buildUpdateProductBodyFromFormData(values));
                this.setState({ updateStatus: FetchStatusEnum.success }, () => {
                    this.props.onRefreshList();
                });
            } catch (error) {
                this.setState({ updateStatus: FetchStatusEnum.failure });
            }
        });
    }

    public render() {
        const { open, onClose } = this.props;

        return (
            <LargeDialog
                open={open}
                onClose={onClose}
                title="Update product"
            >
                <div className={theme.dialogContentWrapper}>
                    {this.renderSubmitStatus()}
                    <Formik
                        initialValues={this.state.initialValues}
                        onSubmit={this.handleSubmit}
                        validationSchema={this.validationSchema}
                    >
                        {(props) => {
                            const { touched, errors, values, handleChange, handleBlur } = props;

                            const handleSelectCategory = (categoryId: string) => {
                                handleChange('categoryId')(categoryId);
                            };

                            return (
                                <Form>
                                    <div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="title"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Title"
                                                    value={values.title}
                                                    helperText={errors.title && touched.title ? errors.title : ''}
                                                    error={!!(errors.title && touched.title)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="description"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Description"
                                                    multiline
                                                    rows={2}
                                                    rowsMax={Infinity}
                                                    value={values.description}
                                                    helperText={errors.description && touched.description ? errors.description : ''}
                                                    error={!!(errors.description && touched.description)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="price"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Price"
                                                    value={values.price}
                                                    helperText={errors.price && touched.price
                                                        ? errors.price
                                                        : 'The latest two digits are cents. Ex: 1530: €15.30'}
                                                    error={!!(errors.price && touched.price)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="quantityInStock"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Quantity in Stock"
                                                    value={values.quantityInStock}
                                                    helperText={errors.quantityInStock && touched.quantityInStock ? errors.quantityInStock : ''}
                                                    error={!!(errors.quantityInStock && touched.quantityInStock)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="tags"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Tags"
                                                    value={values.tags}
                                                    helperText={errors.tags && touched.tags ? errors.tags : ''}
                                                    error={!!(errors.tags && touched.tags)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Card variant="outlined" style={{ borderColor: errors.categoryId && touched.categoryId ? '#f44336' : '#c4c4c4' }}>
                                                    <CardContent>
                                                        <div><b>Category id: {values.categoryId}</b></div>
                                                        {errors.categoryId && touched.categoryId && <div className={theme.fieldError}>You need to choose a category</div>}
                                                        <CategoryTree
                                                            selectedCategoryId={values.categoryId}
                                                            onSelectCategory={handleSelectCategory}
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
                                                disabled={this.isSubmitButtonDisabled()}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </LargeDialog>
        );
    }
}
