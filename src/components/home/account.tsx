import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User, UserSession } from '../../modules/user/model';
import * as UserApi from '../../modules/user/api';
import { formatDateFromMilliseconds } from '../../utils/date-utils';
import { FetchState, FetchStatusEnum } from '../../utils/api-helper';
import { ResultMessageBox } from '../../widgets/result-message-box';

import * as theme from './account.scss';

interface Props {
    userSession: UserSession;
    authToken: string;
}

export const AccountOverview: React.FC<Props> = ({ userSession, authToken }) => {
    const [fetchState, setFetchState] = React.useState<FetchState<User | null>>({ status: FetchStatusEnum.initial, fetchError: null, data: null });

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                setFetchState({ status: FetchStatusEnum.loading, fetchError: null, data: null });
                const userFullData = await UserApi.getUserFullData(userSession.id, authToken);
                setFetchState({ data: userFullData, status: FetchStatusEnum.success, fetchError: null });
            } catch (error) {
                setFetchState({ data: null, status: FetchStatusEnum.failure, fetchError: error.message });
            }
        };

        fetchUser();
    }, []);

    const { data: userFullData, status, fetchError } = fetchState;

    return (
        <div className={theme.contentBox}>
            <Typography component="h2" variant="h5">
                Account overview
            </Typography>
            {status === FetchStatusEnum.loading && <div className={theme.loadingWrapper}><CircularProgress /></div>}
            {status === FetchStatusEnum.failure && <ResultMessageBox type="error" message={fetchError!} />}
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
        </div>
    );
};
