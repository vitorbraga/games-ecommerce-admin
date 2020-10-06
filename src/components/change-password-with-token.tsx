import * as React from 'react';
import * as qs from 'query-string';
import * as Yup from 'yup';
import { RouteComponentProps } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { errorMapper } from '../utils/messages-mapper';
import { checkValidPasswordResetToken, changePasswordWithToken } from '../modules/authentication/api';
import { ResultMessageBox } from '../widgets/result-message-box';
import { appBaseUrl, FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { Form, Formik, FormikHelpers } from 'formik';
import { checkPasswordComplexity } from '../utils/validators';

import * as theme from './change-password-with-token.scss';

interface MatchParams {
    token: string;
    u: string;
}

type Props = RouteComponentProps<MatchParams>;

interface State {
    submitStatus: FetchStatus;
    submitError: string | null;
    tokenIsValid: boolean | undefined;
    tokenCheckError: string;
}

interface FormData {
    newPassword: string;
    newPasswordConfirmation: string;
}

export class ChangePasswordWithToken extends React.PureComponent<Props, State> {
    public state: State = {
        submitStatus: FetchStatusEnum.initial,
        submitError: null,
        tokenIsValid: undefined,
        tokenCheckError: ''
    };

    private formInitialValues: FormData = {
        newPassword: '',
        newPasswordConfirmation: ''
    };

    private validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('New password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPasswordConfirmation: Yup.string()
            .required('New password confirmation is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity)
            .oneOf([Yup.ref('newPassword'), ''], 'New Password and New Password Confirmation must match.')
    });

    public componentDidMount = async () => {
        document.title = 'Change password';
        const parsedUrl = qs.parse(this.props.location.search);
        const token = parsedUrl.token;
        const userId = parsedUrl.u as string;

        if (token && userId) {
            try {
                await checkValidPasswordResetToken(token.toString(), userId);
                this.setState({ tokenIsValid: true });
            } catch (error) {
                this.setState({ tokenIsValid: false, tokenCheckError: error.message });
            }
        } else {
            this.setState({ tokenIsValid: false, tokenCheckError: errorMapper.PASSWORD_RESET_MISSING_TOKEN_USERID });
        }
    };

    private handleSubmit = (formData: FormData, { resetForm }: FormikHelpers<FormData>) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            const parsedUrl = qs.parse(this.props.location.search);
            const token = parsedUrl.token;
            const userId = parsedUrl.u as string;

            try {
                await changePasswordWithToken(formData.newPassword, token!.toString(), userId);
                this.setState({ submitStatus: FetchStatusEnum.success }, () => {
                    resetForm();
                });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, submitError: error });
            }
        });
    };

    private renderSubmitStatus() {
        const { submitStatus, submitError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingWrapper}><CircularProgress /></div>;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message={submitError!} />;
        } else if (submitStatus === FetchStatusEnum.success) {
            const loginUrl = `${appBaseUrl}/login`;
            return <ResultMessageBox type="success">Your password has been changed successfully! <br />Click <a href={loginUrl}>here</a> to login.</ResultMessageBox>;
        }

        return null;
    }

    public render() {
        const { tokenIsValid, tokenCheckError } = this.state;

        if (tokenIsValid === undefined) {
            return null;
        } else if (tokenIsValid) {
            return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={theme.paper}>
                        <Avatar className={theme.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset your password
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
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        name="newPassword"
                                                        label="New password"
                                                        type="password"
                                                        value={values.newPassword}
                                                        helperText={errors.newPassword && touched.newPassword ? errors.newPassword : ''}
                                                        error={!!(errors.newPassword && touched.newPassword)}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        name="newPasswordConfirmation"
                                                        label="Confirm new password"
                                                        type="password"
                                                        value={values.newPasswordConfirmation}
                                                        helperText={errors.newPasswordConfirmation && touched.newPasswordConfirmation ? errors.newPasswordConfirmation : ''}
                                                        error={!!(errors.newPasswordConfirmation && touched.newPasswordConfirmation)}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        className={theme.submit}
                                                    >
                                                        Save
                                                    </Button>
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
        } else {
            return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={theme.paper}>
                        <Typography component="h1" variant="h5">
                            Invalid information
                        </Typography>
                        <ResultMessageBox type="error" message={tokenCheckError} />
                    </div>
                </Container>
            );
        }
    }
}
