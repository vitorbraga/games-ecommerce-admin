import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as Model from '../../modules/overview/model';
import * as OverviewApi from '../../modules/overview/api';

import * as theme from './overview.scss';

interface Props {
    authToken: string;
}

interface State {
    overview: Model.Overview;
}

export class Overview extends React.PureComponent<Props, State> {
    public state: State = {
        overview: { users: 0, orders: 0 }
    };

    public async componentDidMount() {
        const overview = await OverviewApi.getOverview(this.props.authToken);
        this.setState({ overview });
    }

    public render() {
        const { overview } = this.state;

        return (
            <div className={theme.contentBox}>
                <Typography component="h2" variant="h5">
                    Overview
                </Typography>
                <div>
                    <p>Registered users: {overview.users}</p>
                    <p>Orders: {overview.orders}</p>
                </div>
            </div>
        );
    }
}
