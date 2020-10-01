import * as Model from './model';
import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { assertType } from 'typescript-is';
import { errorMapper } from '../../utils/messages-mapper';
import { User } from '../user/model';

export const authenticate = async (username: string, password: string): Promise<string> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ username, password })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/admin/login`, options);
    const data = await response.json();
    const loginResponse: Model.LoginResponse = assertType<Model.LoginResponse>(data);

    if (loginResponse.success) {
        return loginResponse.jwt;
    } else {
        throw new Error(errorMapper[loginResponse.error]);
    }
};

export const passwordRecovery = async (email: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ email })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/password-recovery`, options);
    const data = await response.json();
    const passwordRecoveryResponse: Model.PasswordRecoveryResponse = assertType<Model.PasswordRecoveryResponse>(data);

    if (!passwordRecoveryResponse.success) {
        throw new Error(errorMapper[passwordRecoveryResponse.error]);
    }
};

export const changePasswordWithToken = async (newPassword: string, token: string, userId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build(),
        method: 'POST',
        body: JSON.stringify({ newPassword, token, userId })
    };

    const response: Response = await fetch(`${serverBaseUrl}/auth/password-recovery`, options);
    const data = await response.json();
    const changePasswordResponse: Model.ChangePasswordTokenResponse = assertType<Model.ChangePasswordTokenResponse>(data);

    if (!changePasswordResponse.success) {
        throw new Error(errorMapper[changePasswordResponse.error]);
    }
};

export const changePassword = async (currentPassword: string, newPassword: string, authToken: string): Promise<User> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
    };

    const response = await fetch(`${serverBaseUrl}/auth/change-password`, options);
    const data = await response.json();
    const changePasswordResponse: Model.ChangePasswordResponse = assertType<Model.ChangePasswordResponse>(data);

    if (changePasswordResponse.success) {
        return changePasswordResponse.user;
    } else {
        throw new Error(errorMapper[changePasswordResponse.error]);
    }
};

export const checkValidPasswordResetToken = async (token: string, userId: string): Promise<void> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').build()
    };

    const response = await fetch(`${serverBaseUrl}/auth/check-password-token/${token}/${userId}`, options);
    const data = await response.json();
    const checkPasswordResponse: Model.CheckPasswordTokenResponse = assertType<Model.CheckPasswordTokenResponse>(data);

    if (!checkPasswordResponse.success) {
        throw new Error(errorMapper[checkPasswordResponse.error]);
    }
};
