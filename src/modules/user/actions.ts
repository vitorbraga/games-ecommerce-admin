import { SET_USER_ID, SET_USER, ActionTypes, User } from './model';

export function setUserId(userId: string | null): ActionTypes {
    return {
        type: SET_USER_ID,
        payload: userId
    };
}

export function setUser(user: User | null): ActionTypes {
    return {
        type: SET_USER,
        payload: user
    };
}
