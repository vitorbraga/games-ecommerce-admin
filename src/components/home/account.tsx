import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { User } from '../../modules/user/model';
import { formatDateFromString } from '../../utils/date-utils';

import * as theme from './account.scss';

interface AccountOverviewProps {
    user: User;
}

export class AccountOverview extends React.PureComponent<AccountOverviewProps, never> {
    public render() {
        const { user } = this.props;
        return (
            <div className={theme.contentBox}>
                <Typography component="h2" variant="h5">
                    Account overview
                </Typography>
                <div className={theme.dataContent}>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Name</div>
                        <div className={theme.value}>{`${user.firstName} ${user.lastName}`}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Email</div>
                        <div className={theme.value}>{user.email}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>User role:</div>
                        <div className={theme.value}>{user.role}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Account created at:</div>
                        <div className={theme.value}>{formatDateFromString(user.createdAt)}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Account last updated at:</div>
                        <div className={theme.value}>{formatDateFromString(user.updatedAt)}</div>
                    </div>
                </div>
                <Typography component="h2" variant="h5">
                    Security (change password)
                </Typography>
            </div>
        );
    }
}
