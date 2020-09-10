import * as React from 'react';
import * as qs from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { errorMapper } from '../utils/messages-mapper';
import { checkValidPasswordResetToken, changePasswordWithToken } from '../modules/authentication/api';
import { ResultMessageBox } from '../widgets/result-message-box';

import * as theme from './change-password-with-token.scss';
import { appBaseUrl } from '../utils/api-helper';

interface MatchParams {
    token: string;
    u: string;
}

interface ChangePasswordProps extends RouteComponentProps<MatchParams> {
}

interface ChangePasswordState {
    newPassword: string;
    newPasswordRepeat: string;
    submitError: string | null | undefined;
    submitStage: 'initial' | 'submitting' | 'success';
    tokenIsValid: boolean | undefined;
    tokenCheckError: string;
}

export class ChangePasswordWithToken extends React.PureComponent<ChangePasswordProps, ChangePasswordState> {

    public state: ChangePasswordState = {
        newPassword: '',
        newPasswordRepeat: '',
        submitError: '',
        tokenIsValid: undefined,
        tokenCheckError: '',
        submitStage: 'initial'
    };

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
    }

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value } as Pick<ChangePasswordState, any>);
    }

    private handleSubmit = () => {
        const { newPassword, newPasswordRepeat } = this.state;

        if (!(newPassword && newPasswordRepeat)) {
            this.setState({ submitError: errorMapper.PASSWORD_RESET_REQUIRED_FIELDS });
            return;
        }

        if (newPassword !== newPasswordRepeat) {
            this.setState({ submitError: errorMapper.PASSWORDS_DO_NOT_MATCH });
            return;
        }

        this.setState({ submitStage: 'submitting', submitError: '' }, async () => {
            const parsedUrl = qs.parse(this.props.location.search);
            const token = parsedUrl.token;
            const userId = parsedUrl.u as string;

            try {
                await changePasswordWithToken(newPassword, token!.toString(), userId);
                this.setState({ submitStage: 'success' });
            } catch (error) {
                this.setState({ submitStage: 'initial', submitError: error.message });
            }
        });
    }

    public render() {
        const { submitError, tokenIsValid, tokenCheckError, submitStage } = this.state;
        const loginUrl = `${appBaseUrl}/login`;

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
                            Change password
                        </Typography>
                        {submitError && <ResultMessageBox type="error" message={submitError} />}
                        {submitStage === 'submitting' &&
                            <div className={theme.loadingBox}><CircularProgress /></div>
                        }
                        {submitStage === 'success' &&
                            <div>
                                <ResultMessageBox type="success">
                                    Your password has been changed successfully! <br />Click <a href={loginUrl}>here</a> to login.
                                </ResultMessageBox>
                            </div>
                        }
                        {submitStage === 'initial' &&
                            <div className={theme.form}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    name="newPassword"
                                    label="New password"
                                    type="password"
                                    id="newPassword"
                                    onChange={this.handleInputChange('newPassword')}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    name="newPasswordRepeat"
                                    label="Repeat new password"
                                    type="password"
                                    id="newPasswordRepeat"
                                    onChange={this.handleInputChange('newPasswordRepeat')}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    className={theme.submit}
                                >
                                    Submit
                                </Button>
                            </div>
                        }
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
