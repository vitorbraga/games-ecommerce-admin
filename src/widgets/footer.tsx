import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import * as theme from './footer.scss';

export const Footer = React.memo(() => {
    return (
        <footer className={theme.footer}>
            <nav className={theme.bottomNav}>
                <ul>
                    <li><Link to={'/about'} className={theme.navLink}>About</Link></li>
                    <li><Link to={'/contact'} className={theme.navLink}>Contact</Link></li>
                    <li><Link to={'/terms'} className={theme.navLink}>Terms</Link></li>
                    <li><Link to={'/privacy'} className={theme.navLink}>Privacy</Link></li>
                </ul>
            </nav>
            <Typography variant="body2" color="textSecondary" align="center">
                {`Copyright © MyCompany ${new Date().getFullYear()}.`}
            </Typography>
        </footer>
    );
});
