import * as React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CategoryTree } from '../categories/category-tree';
import { createProduct } from '../../../modules/products/api';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { CreateProductBody } from '../../../modules/products/model';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { ValidationError } from '../../../utils/messages-mapper';
import { checkEmptyCategoryId } from '../../../utils/validators';

import * as theme from './create-product.scss';

interface Props {
    authToken: string;
}

interface FormData {
    title: string;
    description: string;
    price: string;
    quantityInStock: string;
    tags: string;
    categoryId: string;
}

interface State {
    submitStatus: FetchStatus;
    fieldErrors: ValidationError[];
}

export class CreateProduct extends React.PureComponent<Props, State> {
    public state: State = {
        submitStatus: FetchStatusEnum.initial,
        fieldErrors: []
    };

    private formInitialValues: FormData = {
        title: '',
        description: '',
        price: '',
        quantityInStock: '',
        tags: '',
        categoryId: '0'
    };

    private validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required.'),
        description: Yup.string().required('Description is required.'),
        price: Yup.number().required('Price is required.').typeError('Price must have digits only.'),
        quantityInStock: Yup.number().required('Quantity in Stock is required.').typeError('Quantity in Stock must have digits only.'),
        tags: Yup.string().required('Tags are required.'),
        categoryId: Yup.string().test('category-id', 'You need too blaa', checkEmptyCategoryId)
    });

    private createProductBodyFromFormData = (formData: FormData): CreateProductBody => {
        return {
            ...formData,
            price: (parseFloat(formData.price) * 100).toString(),
            quantityInStock: parseInt(formData.quantityInStock, 10)
        };
    };

    private handleSubmit = (values: FormData, { resetForm }: FormikHelpers<FormData>) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                await createProduct(this.props.authToken, this.createProductBodyFromFormData(values));
                this.setState({ submitStatus: FetchStatusEnum.success }, () => {
                    resetForm();
                });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure });
            }
        });
    };

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
                <Formik
                    initialValues={this.formInitialValues}
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
                                            <NumberFormat
                                                value={values.price}
                                                variant="outlined"
                                                fullWidth
                                                name="price"
                                                label="Price"
                                                customInput={TextField}
                                                prefix="€"
                                                type="text"
                                                thousandSeparator=" "
                                                decimalSeparator="."
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                allowNegative={false}
                                                helperText={errors.price && touched.price
                                                    ? errors.price
                                                    : 'The latest two digits are cents. Ex: 1530: €15.30'}
                                                error={!!(errors.price && touched.price)}
                                                onBlur={handleBlur}
                                                onValueChange={({ value }) => handleChange({ target: { name: 'price', value } })}
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
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    }
}
