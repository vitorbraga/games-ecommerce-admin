import { UserState, User } from './model';

export const userId = (state: UserState): string | null => state.userId;

export const user = (state: UserState): User | null => state.user;
