import * as React from 'react';
import { History, LocationState } from 'history';
import * as jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authenticate } from '../modules/authentication/api';
import { JwtAuthToken } from '../modules/authentication/helpers';
import { errorMapper } from '../utils/messages-mapper';
import { ResultMessageBox } from '../widgets/result-message-box';
import { User } from '../modules/user/model';

import * as theme from './login.scss';

interface LoginProps {
    authToken: string | null;
    setAuthenticationToken: (authToken: string | null) => void;
    setUser: (user: User | null) => void;
    history: History<LocationState>;
}

interface LoginState {
    email: string;
    password: string;
    loginError: string | null | undefined;
    submitLoading: boolean;
}

export class Login extends React.PureComponent<LoginProps, LoginState> {
    public state: LoginState = {
        email: '',
        password: '',
        loginError: null,
        submitLoading: false
    };

    private isValidBeforeLogin(): boolean {
        const { email, password } = this.state;
        if (!(email && password)) {
            return false;
        }

        return true;
    }

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value } as Pick<LoginState, any>);
    }

    private handleSubmit = () => {
        if (this.isValidBeforeLogin()) {
            this.setState({ submitLoading: true, loginError: null }, async () => {
                try {
                    const authenticationToken = await authenticate(this.state.email, this.state.password);
                    const decoded = jwtDecode<JwtAuthToken>(authenticationToken);
                    this.props.setAuthenticationToken(authenticationToken);
                    this.props.setUser(decoded.user);

                    this.props.history.push('/home');
                } catch (error) {
                    this.setState({ submitLoading: false, loginError: error.message });
                }
            });
        } else {
            this.setState({ loginError: errorMapper.LOGIN_ENTER_EMAIL_PWD });
        }
    }

    private handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    public render() {
        const { loginError, submitLoading } = this.state;

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
                    {loginError && <ResultMessageBox type="error" message={loginError} />}
                    {submitLoading && <div className={theme.loadingBox}><CircularProgress /></div>}
                    <div className={theme.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            onKeyUp={this.handleKeyUp}
                            onChange={this.handleInputChange('email')}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onKeyUp={this.handleKeyUp}
                            onChange={this.handleInputChange('password')}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
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
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>
        );
    }
}
