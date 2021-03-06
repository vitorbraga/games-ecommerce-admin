import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { History, LocationState } from 'history';
import * as jwtDecode from 'jwt-decode';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authenticate } from '../modules/authentication/api';
import { JwtAuthToken } from '../modules/authentication/helpers';
import { ResultMessageBox } from '../widgets/result-message-box';
import { UserSession } from '../modules/user/model';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { AppState } from '../store';
import { setAuthToken } from '../modules/authentication/actions';
import { setUserSession } from '../modules/user/actions';

import * as theme from './login.scss';

interface Props {
    onSetAuthenticationToken: (authToken: string | null) => void;
    onSetUserSession: (userSession: UserSession | null) => void;
    history: History<LocationState>;
}

interface State {
    submitStatus: FetchStatus;
    loginError: string | null;
}

interface FormData {
    email: string;
    password: string;
}

class Login extends React.PureComponent<Props, State> {
    public state: State = {
        submitStatus: FetchStatusEnum.initial,
        loginError: null
    };

    private formInitialValues: FormData = {
        email: '',
        password: ''
    };

    private validationSchema = Yup.object().shape({
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    private handleSubmit = async (formData: FormData) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                const authenticationToken = await authenticate(formData.email, formData.password);
                const decoded = jwtDecode<JwtAuthToken>(authenticationToken);
                this.props.onSetAuthenticationToken(authenticationToken);
                this.props.onSetUserSession(decoded.userSession);

                this.props.history.push('/home');
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, loginError: error.message });
            }
        });
    };

    private handleResetSubmitStatus = () => {
        this.setState({ submitStatus: FetchStatusEnum.initial });
    };

    private renderSubmitStatus() {
        const { submitStatus, loginError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingWrapper}><CircularProgress /></div>;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message={loginError!} onClose={this.handleResetSubmitStatus} />;
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
                        Sign in
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
                                                    name="email"
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Email Address"
                                                    value={values.email}
                                                    helperText={errors.email && touched.email ? errors.email : ''}
                                                    error={!!(errors.email && touched.email)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    autoFocus
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
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={theme.submit}
                                        >
                                            Sign In
                                        </Button>
                                        <Grid container style={{ marginTop: '10px' }}>
                                            <Grid item xs>
                                                <Link to={'/password-recovery'}>
                                                    Forgot password?
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Link to={'/register'}>
                                                    Admin registration
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

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onSetAuthenticationToken: (authToken: string | null) => dispatch(setAuthToken(authToken)),
    onSetUserSession: (userSession: UserSession | null) => dispatch(setUserSession(userSession))
});

export const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
