import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import * as theme from './overview.scss';

export class Overview extends React.PureComponent<{}, never> {
    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h2" variant="h5">
                    Overview
                </Typography>
                <div>Some overview, with number of product, number of orders, number of users</div>
            </div>
        );
    }
}
