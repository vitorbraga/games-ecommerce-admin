import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router';
import { isAuthenticated } from '../modules/authentication/helpers';
import { authToken } from '../modules/authentication/selector';
import { AppState } from '../store';

interface ProtectedRouteProps extends RouteProps {
    authToken: string | null;
    authenticationPath: string;
}

class PrivateRoute extends Route<ProtectedRouteProps> {
    public render() {
        let redirectPath: string = '';
        if (!isAuthenticated(this.props.authToken)) {
            redirectPath = this.props.authenticationPath;
        }

        if (redirectPath) {
            const renderComponent = () => (<Redirect to={{ pathname: redirectPath }} />);
            return <Route {...this.props} component={renderComponent} render={undefined} />;
        } else {
            return <Route {...this.props}/>;
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    authToken: authToken(state.authentication),
    authenticationPath: '/login'
});

export const PrivateRouteContainer = connect(mapStateToProps)(PrivateRoute);
