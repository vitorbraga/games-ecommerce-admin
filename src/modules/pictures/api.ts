import { serverBaseUrl, headersBuilder } from '../../utils/api-helper';
import * as Model from './model';
import { getErrorMessage } from '../../utils/messages-mapper';

export const deletePicture = async (authToken: string, pictureId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build(),
        method: 'DELETE'
    };

    const response: Response = await fetch(`${serverBaseUrl}/pictures/${pictureId}`, options);
    const deletePictureResponse: Model.DeletePictureResponse = await response.json();

    if ('error' in deletePictureResponse) {
        throw new Error(getErrorMessage(deletePictureResponse.error));
    }
};
