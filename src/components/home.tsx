import * as React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Footer } from '../widgets/footer';

import * as theme from './home.scss';

// FIXME Issue: https://github.com/mui-org/material-ui/issues/15827
const LoginLink = React.forwardRef<HTMLButtonElement, any>((props, ref) => <Link {...props} innerRef={ref as any} to="/login" />);
const RegisterLink = React.forwardRef<HTMLButtonElement, any>((props, ref) => <Link {...props} innerRef={ref as any} to="/register" />);

const RegisterButton = withStyles(() => ({
    root: {
        color: '#0097A7',
        backgroundColor: 'white'
    }
}))(Button as any);

export class Home extends React.PureComponent<{}, never> {
    public render() {
        return (
            <div className={theme.fullContainer}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <div className={theme.hiddenSpan} />
                        <Button color="inherit" component={LoginLink} className={theme.loginButton}>Login</Button>
                        <RegisterButton color="inherit" variant="contained" component={RegisterLink}>Register</RegisterButton>
                    </Toolbar>
                </AppBar>
                <div className={theme.centerContent} />
                <Footer />
            </div>
        );
    }
}
