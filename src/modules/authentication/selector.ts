import { AuthenticationState } from './model';

export const getAuthToken = (state: AuthenticationState) => state.authToken;
