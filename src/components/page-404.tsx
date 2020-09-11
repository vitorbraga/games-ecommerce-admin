import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Footer } from '../widgets/footer';

import * as theme from './page-404.scss';

export const Page404: React.FC<{}> = () => {
    return (
        <div className={theme.root}>
            <CssBaseline />
            <Container component="main" className={theme.mainContainer} maxWidth="sm">
                <span className={theme.bigLabel}>404</span>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                        Oops, we can't find that page.
                </Typography>
                <Typography variant="body1">Click <Link to={'/'} className={theme.navLink}>here</Link> to go back to the homepage.</Typography>
            </Container>
            <Footer />
        </div>
    );
};
