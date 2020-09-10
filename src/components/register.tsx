import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { History, LocationState } from 'history';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { registerUser } from '../modules/user/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { checkPasswordComplexity } from '../utils/validators';
import { errorMapper } from '../utils/messages-mapper';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { ResultMessageBox } from '../widgets/result-message-box';

import * as theme from './register.scss';

interface Props {
    history: History<LocationState>;
}

interface State {
    registerError: string | null | undefined;
    submitStatus: FetchStatus;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class Register extends React.PureComponent<Props, State> {
    public state: State = {
        registerError: null,
        submitStatus: FetchStatusEnum.initial
    };

    private formInitialValues: FormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };

    private validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().required('Password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity)
    });

    private handleSubmit = async (formData: FormData) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                const userOrFieldsWithErrors = await registerUser(formData);
                if ('id' in userOrFieldsWithErrors) {
                    this.props.history.push('/register-success');
                } else {
                    const fieldsWithErrors = userOrFieldsWithErrors;
                    if (fieldsWithErrors.length > 0) {
                        this.setState({ submitStatus: FetchStatusEnum.failure, registerError: errorMapper[Object.values(fieldsWithErrors[0].constraints)[0]] });
                    }
                }
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, registerError: error.message });
            }
        });
    }

    private handleResetSubmitStatus = () => {
        this.setState({ submitStatus: FetchStatusEnum.initial });
    }

    private renderSubmitStatus() {
        const { submitStatus, registerError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message={registerError!} onClose={this.handleResetSubmitStatus} />;
        }

        return null;
    }

    public render() {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={theme.paper}>
                    <Avatar className={theme.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {this.renderSubmitStatus()}
                    <Formik
                        initialValues={this.formInitialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                    >
                        {(props) => {
                            const { touched, errors, values, handleChange, handleBlur } = props;

                            return (
                                <Form>
                                    <div className={theme.form}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="firstName"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="First Name"
                                                    value={values.firstName}
                                                    helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                                                    error={!!(errors.firstName && touched.firstName)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="lastName"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Last Name"
                                                    value={values.lastName}
                                                    helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                                                    error={!!(errors.lastName && touched.lastName)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="email"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Email Address"
                                                    value={values.email}
                                                    helperText={errors.email && touched.email ? errors.email : ''}
                                                    error={!!(errors.email && touched.email)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="password"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Password"
                                                    type="password"
                                                    value={values.password}
                                                    helperText={errors.password && touched.password ? errors.password : ''}
                                                    error={!!(errors.password && touched.password)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Grid>
                                        </Grid>
                                        <div className={theme.submitWrapper}>
                                            <Button type="submit" fullWidth variant="contained" color="primary">
                                                Sign Up
                                            </Button>
                                        </div>
                                        <Grid container justify="flex-end">
                                            <Grid item>
                                                <Link to={'/login'}>
                                                    Already have an account? Sign in
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </Container>
        );
    }
}
