import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { History, LocationState } from 'history';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as AuthenticationApi from '../modules/authentication/api';
import { ResultMessageBox } from '../widgets/result-message-box';
import { successMapper } from '../utils/messages-mapper';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';

import * as theme from './password-recovery.scss';

interface Props {
    history: History<LocationState>;
}

interface State {
    email: string;
    submitStatus: FetchStatus;
    emailFieldError: string;
    submitLoading: boolean;
    submitError: string;
    passwordRecoveryProcessed: boolean;
}

interface FormData {
    email: string;
}

export class PasswordRecovery extends React.PureComponent<Props, State> {
    public state: State = {
        email: '',
        submitStatus: FetchStatusEnum.initial,
        emailFieldError: '',
        submitLoading: false,
        submitError: '',
        passwordRecoveryProcessed: false
    };

    private formInitialValues: FormData = {
        email: ''
    };

    private validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
    });

    private handleSubmit = async (formData: FormData, { resetForm }: FormikHelpers<FormData>) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AuthenticationApi.passwordRecovery(formData.email);
                this.setState({ submitStatus: FetchStatusEnum.success }, () => {
                    resetForm();
                });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, submitError: error.message });
            }
        });
    };

    private renderStatus() {
        const { submitStatus, submitError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingBox}><CircularProgress /></div>;
        }

        if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message={submitError} />;
        }

        if (submitStatus === FetchStatusEnum.success) {
            return <ResultMessageBox type="success" message={successMapper.PASSWORD_RESET_EMAIL_SENT} />;
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
                        Password recovery
                    </Typography>
                    <p>Enter your e-mail address below. We'll send an email message within a few minutes so you can create a new password.</p>
                    {this.renderStatus()}
                    <Formik
                        initialValues={this.formInitialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                    >
                        {(props) => {
                            const { touched, errors, values, handleChange, handleBlur } = props;

                            return (
                                <Form style={{ width: '100%' }}>
                                    <div className={theme.form}>
                                        <Grid container spacing={2}>
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
                                        </Grid>
                                        <div className={theme.submitWrapper}>
                                            <Button type="submit" fullWidth variant="contained" color="primary">
                                                Submit
                                            </Button>
                                        </div>
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
