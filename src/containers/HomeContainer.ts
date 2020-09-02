import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { authToken } from '../modules/authentication/selector';
import { userLogout } from '../modules/authentication/actions';
import { Home } from '../components/home/home';
import { userId, user } from '../modules/user/selector';
import { setUser } from '../modules/user/actions';
import { User } from '../modules/user/model';

const mapStateToProps = (state: AppState) => ({
    authToken: authToken(state.authentication),
    userId: userId(state.user),
    user: user(state.user)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setUser: (user: User | null) => dispatch(setUser(user)),
    userLogout: () => dispatch(userLogout())
});

export const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
