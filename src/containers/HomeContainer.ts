import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { getAuthToken } from '../modules/authentication/selector';
import { userLogout } from '../modules/authentication/actions';
import { Home } from '../components/home/home';
import { getUserSession } from '../modules/user/selector';
import { setUserSession } from '../modules/user/actions';
import { UserSession } from '../modules/user/model';

const mapStateToProps = (state: AppState) => ({
    authToken: getAuthToken(state.authentication),
    userSession: getUserSession(state.user)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onSetUserSession: (userSession: UserSession | null) => dispatch(setUserSession(userSession)),
    onUserLogout: () => dispatch(userLogout())
});

export const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
