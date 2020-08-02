import * as React from 'react';
import { is } from 'typescript-is';
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
import { checkPasswordComplexity, isEmail } from '../utils/validators';
import { errorMapper, ValidationError } from '../utils/messages-mapper';
import { notUndefined } from '../utils/common-helper';
import { User } from '../modules/user/model';

import * as theme from './register.scss';

interface RegisterProps {
    history: History<LocationState>;
}

interface RegisterState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    submitLoading: boolean;
    fieldErrors: ValidationError[];
}

interface FormFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class Register extends React.PureComponent<RegisterProps, RegisterState> {

    public state: RegisterState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        submitLoading: false,
        fieldErrors: []
    };

    private isValidBeforeSubmit(): ValidationError[] {
        const validationErrors = ['firstName', 'lastName', 'email', 'password'].map((item: keyof FormFields) => {
            if (!this.state[item]) {
                return { field: item, errorMessage: errorMapper.REGISTER_REQUIRED_FIELD };
            }

        }).filter(notUndefined);

        if (validationErrors.length > 0) {
            return validationErrors;
        }

        if (!isEmail(this.state.email)) {
            validationErrors.push({ field: 'email', errorMessage: errorMapper.REGISTER_INVALID_EMAIL });
            return validationErrors;
        }

        if (!checkPasswordComplexity(this.state.password)) {
            validationErrors.push({ field: 'password', errorMessage: errorMapper.REGISTER_PASSWORD_COMPLEXITY });
            return validationErrors;
        }

        return [];
    }

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value } as Pick<RegisterState, any>);
    }

    private handleSubmit = async () => {
        const validationErrors = this.isValidBeforeSubmit();
        if (validationErrors.length === 0) {
            this.setState({ submitLoading: true }, async () => {
                try {
                    const userOrFieldsWithErrors = await registerUser(this.state);
                    if (is<User>(userOrFieldsWithErrors)) {
                        this.props.history.push('/register-success');
                    } else {
                        const fieldsWithErrors = userOrFieldsWithErrors;
                        if (fieldsWithErrors.length > 0) {
                            const errors = fieldsWithErrors.map((item) => {
                                return { field: item.field, errorMessage: errorMapper[Object.values(item.constraints)[0]] };
                            });
                            this.setState({ submitLoading: false, fieldErrors: errors });
                        }
                    }
                } catch (error) {
                    // TODO add error message (generic error messages that do not belong to fields)
                    // TODO Add state property and show on the top of the form
                    this.setState({ submitLoading: false, fieldErrors: [] });
                }
            });
        } else {
            this.setState({ fieldErrors: validationErrors });
        }
    }

    public render() {
        const { fieldErrors, submitLoading } = this.state;
        const firstNameValidationError = fieldErrors.find((item) => item.field === 'firstName');
        const lastNameValidationError = fieldErrors.find((item) => item.field === 'lastName');
        const emailValidationError = fieldErrors.find((item) => item.field === 'email');
        const passwordValidationError = fieldErrors.find((item) => item.field === 'password');

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
                    {submitLoading && <div className={theme.loadingBox}><CircularProgress /></div>}
                    <div className={theme.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="First Name"
                                    error={!!firstNameValidationError}
                                    helperText={firstNameValidationError && firstNameValidationError.errorMessage}
                                    onChange={this.handleInputChange('firstName')}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    error={!!lastNameValidationError}
                                    helperText={lastNameValidationError && lastNameValidationError.errorMessage}
                                    onChange={this.handleInputChange('lastName')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    error={!!emailValidationError}
                                    helperText={emailValidationError && emailValidationError.errorMessage}
                                    onChange={this.handleInputChange('email')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    error={!!passwordValidationError}
                                    helperText={passwordValidationError ? passwordValidationError.errorMessage :
                                        errorMapper.REGISTER_PASSWORD_COMPLEXITY}
                                    onChange={this.handleInputChange('password')}
                                />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid> */}
                        </Grid>
                        <div className={theme.submitWrapper}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                            >
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
                </div>
            </Container>
        );
    }
}
