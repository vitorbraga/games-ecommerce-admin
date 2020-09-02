import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import * as theme from './products.scss';

export class Products extends React.PureComponent<{}, never> {
    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h2" variant="h5">
                    Products
                </Typography>
            </div>
        );
    }
}
