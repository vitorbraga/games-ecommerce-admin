/* eslint-disable no-underscore-dangle */
import { compose, createStore, combineReducers, Action } from 'redux';
import { authenticationReducer } from './modules/authentication/reducer';
import { userReducer } from './modules/user/reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

declare global {
    interface Window {
      // eslint-disable-next-line no-undef
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const appReducer = combineReducers({
    authentication: authenticationReducer,
    user: userReducer
});

const rootReducer = (state: any, action: Action) => {
    if (action.type === 'USER_LOGOUT') {
        storage.removeItem('persist:root');
        state = undefined;
    }

    return appReducer(state, action);
};

export type AppState = ReturnType<typeof rootReducer>;

const persistConfig = { key: 'root', storage };

const initialState: AppState = {
    authentication: {
        authToken: null
    },
    user: {
        userSession: null
    }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, initialState, composeEnhancers());
const persistor = persistStore(store);

export { store, persistor };
