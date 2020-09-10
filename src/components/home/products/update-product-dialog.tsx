import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Model from '../../../modules/products/model';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';

import * as theme from './update-product-dialog.scss';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { checkEmptyCategoryId } from '../../../utils/validators';

interface Props {
    authToken: string;
    product: Model.Product;
    open: boolean;
    onClose: () => void;
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
            return <ResultMessageBox type="error" message="Failed creating category. Please try again." />;
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

    private handleSubmit = (values: FormData) => {
        console.log('handleSubmit', values);
        // this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
        //     try {
        //         await createProduct(this.props.authToken, this.createProductBodyFromFormData(values));
        //         this.setState({ submitStatus: FetchStatusEnum.success }, () => {
        //             resetForm();
        //         });
        //     } catch (error) {
        //         this.setState({ submitStatus: FetchStatusEnum.failure });
        //     }
        // });
    }

    public render() {
        const { open, onClose } = this.props;
        console.log(this.props.product);

        return (
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                onClose={onClose}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Update product</DialogTitle>
                <DialogContent>
                    <div className={theme.dialogContentWrapper}>
                        {this.renderSubmitStatus()}
                        <Formik
                            initialValues={this.state.initialValues}
                            onSubmit={this.handleSubmit}
                            validationSchema={this.validationSchema}
                        >
                            {(props) => {
                                const { touched, errors, values, handleChange, handleBlur } = props;

                                return (
                                    <Form>
                                        <div className={theme.formWrapper}>
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
                                            </Grid>
                                            <div className={theme.submitWrapper}>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
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
                </DialogContent>
            </Dialog>
        );
    }
}
