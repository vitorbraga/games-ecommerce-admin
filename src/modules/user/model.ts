export const SET_USER_SESSION = 'SET_USER_SESSION';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: number;
    updatedAt: number;
}

export interface UserSession {
    id: string;
    firstName: string;
}

export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserUpdate {
    firstName: string;
    lastName: string;
}

export interface FieldWithError {
    field: string;
    constraints: {
        [type: string]: string;
    };
}

export type UserRegisterResponse = {
    success: true;
    user: User;
} | {
    success: false;
    fields: FieldWithError[];
} | {
    success: false;
    error: string;
};

export type ChangePasswordResponse = {
    success: true;
    user: User;
} | {
    success: false;
    error: string;
};

export type UserUpdateResponse = UserRegisterResponse;

export type GetUserResponse = {
    success: true;
    user: User;
} | {
    success: false;
    error: string;
};

interface SetUserSessionAction { type: typeof SET_USER_SESSION, payload: UserSession | null }

export interface UserState {
    userSession: UserSession | null;
}

export type ActionTypes = SetUserSessionAction;
