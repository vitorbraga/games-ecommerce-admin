import * as jwtDecode from 'jwt-decode';

export interface JwtAuthToken {
    exp: number;
    iat: number;
    userId: number;
    email: string;
}

export const isAuthenticated = (authToken: string | null): boolean => {
    if (authToken === null) {
        return false;
    }

    const decoded = jwtDecode<JwtAuthToken>(authToken);
    if (decoded.exp * 1000 < Date.now()) {
        return false;
    }

    return true;
};
