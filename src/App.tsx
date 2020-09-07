import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Home } from './components/Home';
import { About} from './components/About';
import { LoginContainer } from './containers/LoginContainer';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Register } from './components/register';
import { Page404 } from './components/page-404';
import { RegisterSuccess } from './components/register-success';
import { PrivateRouteContainer } from './utils/private-route';
import { HomeContainer } from './containers/HomeContainer';
import { PasswordRecovery } from './components/password-recovery';
import { ChangePasswordWithToken } from './components/change-password-with-token';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00BCD4',
            light: '#B2EBF2',
            dark: '#0097A7',
            contrastText: '#fff'
        },
        secondary: {
            main: '#ccc',
            light: '#e35183',
            dark: '#78002e'
        }
        // error: will use the default color
    }
});

export class App extends React.Component<{}, never> {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <MuiThemeProvider theme={theme}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route path="/login" component={LoginContainer} />
                                    <Route path="/register" component={Register} />
                                    <PrivateRouteContainer path="/home" component={HomeContainer} />
                                    <Route path="/register-success" component={RegisterSuccess} />
                                    <Route path="/about" component={About} />
                                    <Route path="/password-recovery" component={PasswordRecovery} />
                                    <Route path="/change-password" component={ChangePasswordWithToken} />
                                    <Route component={Page404} />
                                </Switch>
                            </div>
                        </MuiThemeProvider>
                    </Router>
                </PersistGate>
            </Provider>
        );
      }
}
