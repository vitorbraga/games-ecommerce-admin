import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { User, UserSession } from '../../modules/user/model';
import * as UserApi from '../../modules/user/api';
import { formatDateFromMilliseconds } from '../../utils/date-utils';

import * as theme from './account.scss';

interface Props {
    userSession: UserSession;
    authToken: string;
}

export const AccountOverview: React.FC<Props> = ({ userSession, authToken }) => {
    const [userFullData, setUserFullData] = React.useState<User | null>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                // TODO Improve this code, putting all together in the same object to make one single call
                // setLoading(true);
                const userFullData = await UserApi.getUserFullData(userSession.id, authToken);
                setUserFullData(userFullData);
                // setLoading(false);
            } catch (error) {
                // setFetchError(error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className={theme.contentBox}>
            <Typography component="h2" variant="h5">
                Account overview
            </Typography>
            {userFullData
                && <div className={theme.dataContent}>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Name</div>
                        <div className={theme.value}>{`${userFullData.firstName} ${userFullData.lastName}`}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Email</div>
                        <div className={theme.value}>{userFullData.email}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>User role:</div>
                        <div className={theme.value}>{userFullData.role}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Account created at:</div>
                        <div className={theme.value}>{formatDateFromMilliseconds(userFullData.createdAt)}</div>
                    </div>
                    <div className={theme.dataRow}>
                        <div className={theme.label}>Account last updated at:</div>
                        <div className={theme.value}>{formatDateFromMilliseconds(userFullData.updatedAt)}</div>
                    </div>
                </div>
            }
            <Typography component="h2" variant="h5" style={{ marginTop: '20px' }}>
                Security (change password)
            </Typography>
        </div>
    );
};
