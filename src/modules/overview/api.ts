import { serverBaseUrl, headersBuilder } from '../../utils/api-helper';
import * as Model from './model';
import { getErrorMessage } from '../../utils/messages-mapper';

export const getOverview = async (authToken: string): Promise<Model.Overview> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/overview`, options);
    const getOverviewResponse: Model.GetOverviewResponse = await response.json();

    if ('error' in getOverviewResponse) {
        throw new Error(getErrorMessage(getOverviewResponse.error));
    }

    return getOverviewResponse.overview;
};
