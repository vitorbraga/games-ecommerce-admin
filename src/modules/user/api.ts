import * as Model from './model';
import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { assertType } from 'typescript-is';
import { errorMapper } from '../../utils/messages-mapper';

export const registerUser = async (user: Model.UserRegister): Promise<Model.User | Model.FieldWithError[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify(user)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users`, options);
    const data = await response.json();
    const userRegisterResponse: Model.UserRegisterResponse = assertType<Model.UserRegisterResponse>(data);

    if (userRegisterResponse.success) {
        return userRegisterResponse.user;
    } else if ('fields' in userRegisterResponse) {
        return userRegisterResponse.fields;
    } else {
        throw new Error(errorMapper[userRegisterResponse.error]);
    }
};

export const updateUser = async (userId: string, user: Model.UserUpdate, authToken: string): Promise<Model.User | Model.FieldWithError[]> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'PATCH',
        body: JSON.stringify(user)
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}`, options);
    const data = await response.json();
    const userUpdateResponse: Model.UserUpdateResponse = assertType<Model.UserUpdateResponse>(data);

    if (userUpdateResponse.success) {
        return userUpdateResponse.user;
    } else if ('fields' in userUpdateResponse) {
        return userUpdateResponse.fields;
    } else {
        throw new Error(errorMapper[userUpdateResponse.error]);
    }
};

export const getUser = async (userId: string, authToken: string): Promise<Model.User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}`, options);
    const data = await response.json();
    const userResponse: Model.GetUserResponse = assertType<Model.GetUserResponse>(data);

    if (userResponse.success) {
        return userResponse.user;
    } else {
        throw new Error(errorMapper[userResponse.error]);
    }
};

export const getUserFullData = async (userId: string, authToken: string): Promise<Model.User> => {
    const options = {
        headers: headersBuilder().withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/full`, options);
    const userResponse: Model.GetUserResponse = await response.json();

    if (userResponse.success) {
        return userResponse.user;
    } else {
        throw new Error(errorMapper[userResponse.error]);
    }
};
