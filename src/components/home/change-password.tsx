import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ResultMessageBox } from '../../widgets/result-message-box';
import { errorMapper } from '../../utils/messages-mapper';
import { UserSession } from '../../modules/user/model';
import * as UserApi from '../../modules/user/api';
import { checkPasswordComplexity } from '../../utils/validators';
import { FetchStatus, FetchStatusEnum } from '../../utils/api-helper';

import * as theme from './change-password.scss';

interface Props {
    authToken: string | null;
    userSession: UserSession;
}

interface State {
    submitStatus: FetchStatus;
    submitError: string | null;
}

interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

export class ChangePassword extends React.PureComponent<Props, State> {
    public state: State = {
        submitStatus: FetchStatusEnum.initial,
        submitError: null
    };

    private formInitialValues: FormData = {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
    };

    private validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Current password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPassword: Yup.string()
            .required('New password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPasswordConfirmation: Yup.string()
            .required('New password confirmation is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity)
            .oneOf([Yup.ref('newPassword'), ''], 'New Password and New Password Confirmation must match.')
    });

    private handleSubmit = (formData: FormData, { resetForm }: FormikHelpers<FormData>) => {
        const { authToken } = this.props;

        if (authToken !== null) {
            this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
                try {
                    await UserApi.changePassword(formData.currentPassword, formData.newPassword, authToken);
                    this.setState({ submitStatus: FetchStatusEnum.success }, () => {
                        resetForm();
                    });
                } catch (error) {
                    this.setState({ submitStatus: FetchStatusEnum.failure, submitError: error });
                }
            });
        }
    };

    private renderSubmitStatus() {
        const { submitStatus, submitError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingWrapper}><CircularProgress /></div>;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message={submitError!} />;
        } else if (submitStatus === FetchStatusEnum.success) {
            return <ResultMessageBox type="success" message="Password updated successfully." />;
        }

        return null;
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <CssBaseline />
                <Typography component="h2" variant="h5">
                    Change password
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
                                                name="currentPassword"
                                                label="Current password"
                                                type="password"
                                                value={values.currentPassword}
                                                helperText={errors.currentPassword && touched.currentPassword ? errors.currentPassword : ''}
                                                error={!!(errors.currentPassword && touched.currentPassword)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Grid>
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
        );
    }
}
