import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ResultMessageBox } from '../../widgets/result-message-box';
import { errorMapper } from '../../utils/messages-mapper';
import { User } from '../../modules/user/model';
import { changePassword } from '../../modules/authentication/api';

import * as theme from './change-password.scss';

interface ChangePasswordProps {
    authToken: string | null;
    onSetUser: (user: User) => void;
    user: User;
}

interface ChangePasswordState {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
    submitError: string | null | undefined;
    submitLoading: boolean;
    updateSuccess: boolean;
}

const emptyInputs: Pick<ChangePasswordState, any> = { currentPassword: '', newPassword: '', newPasswordRepeat: '' };
const resetFeedbacks: Pick<ChangePasswordState, any> = { updateSuccess: false, submitError: '' };

export class ChangePassword extends React.PureComponent<ChangePasswordProps, ChangePasswordState> {
    public state: ChangePasswordState = {
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
        submitError: '',
        submitLoading: false,
        updateSuccess: false
    };

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value, ...resetFeedbacks } as Pick<ChangePasswordState, any>);
    }

    private handleSubmit = () => {
        const { authToken, onSetUser } = this.props;
        const { currentPassword, newPassword, newPasswordRepeat } = this.state;

        if (!(currentPassword && newPassword && newPasswordRepeat)) {
            this.setState({ submitError: errorMapper.CHANGE_PASSWORD_REQUIRED_FIELDS });
            return;
        }

        if (newPassword !== newPasswordRepeat) {
            this.setState({ submitError: errorMapper.PASSWORDS_DO_NOT_MATCH });
            return;
        }

        if (authToken !== null) {
            this.setState({ submitLoading: true, ...resetFeedbacks }, async () => {
                try {
                    const user = await changePassword(currentPassword, newPassword, authToken);
                    onSetUser(user);
                    this.setState({ submitLoading: false, updateSuccess: true, ...emptyInputs });
                } catch (error) {
                    this.setState({ submitLoading: false, updateSuccess: false, submitError: error });
                }
            });
        }
    }

    public render() {
        const { submitError, submitLoading, updateSuccess } = this.state;

        return (
            <div className={theme.contentBox}>
                <CssBaseline />
                <Typography component="h2" variant="h5">
                    Change password
                </Typography>
                {submitError && <ResultMessageBox type="error" message={submitError} />}
                {submitLoading &&
                    <div className={theme.loadingBox}><CircularProgress /></div>
                }
                {updateSuccess &&
                    <div>
                        <ResultMessageBox type="success">
                            Your password has been changed successfully!
                        </ResultMessageBox>
                    </div>
                }
                <div className={theme.formContent}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="currentPassword"
                                label="Current password"
                                type="password"
                                id="currentPassword"
                                value={this.state.currentPassword}
                                onChange={this.handleInputChange('currentPassword')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="newPassword"
                                label="New password"
                                type="password"
                                id="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleInputChange('newPassword')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="newPasswordRepeat"
                                label="Repeat new password"
                                type="password"
                                id="newPasswordRepeat"
                                value={this.state.newPasswordRepeat}
                                onChange={this.handleInputChange('newPasswordRepeat')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className={theme.submit}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
