import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { History, LocationState } from 'history';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { TypographyProps } from '@material-ui/system';
import { UserSession } from '../../modules/user/model';
import { AccountOverview } from './account';
import { Overview } from './overview';
import { Categories } from './categories/categories';
import { Products } from './products/products';
import { AppState } from '../../store';
import { getAuthToken } from '../../modules/authentication/selector';
import { userLogout } from '../../modules/authentication/actions';
import { getUserSession } from '../../modules/user/selector';

import * as theme from './home.scss';
import { ChangePassword } from './change-password';

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            className={theme.tabPanel}
            {...other}
        >
            <Box p={1} pl={2}>{children}</Box>
        </Typography>
    );
};

const CustomTab = withStyles(() => ({
    selected: { color: '#00BCD4' },
    wrapper: { alignItems: 'start' }
}))(Tab);

interface Props {
    authToken: string | null;
    userSession: UserSession | null;
    onUserLogout: () => void;
    history: History<LocationState>;
}

interface State {
    anchorEl: Element | null;
    tabValue: number;
    categoryTabKey: number;
}

interface TabPanelProps extends TypographyProps {
    value: number;
    index: number;
    children: React.ReactNode;
}

type TabsKeys = '' | 'account' | 'categories' | 'products' | 'change-password';

const tabsMapper = {
    '': 0,
    'categories': 1,
    'products': 2,
    'account': 3,
    'change-password': 4
};

function getTabValue(): number {
    const url = location.href;
    const hashtagIndex = url.indexOf('#');
    if (hashtagIndex !== -1) {
        const key = url.substring(hashtagIndex + 1, url.length) as TabsKeys;
        return tabsMapper[key || ''];
    }

    return 0;
}

class Home extends React.PureComponent<Props, State> {
    public state: State = {
        anchorEl: null,
        tabValue: getTabValue(),
        categoryTabKey: 0
    };

    private a11yProps = (index: number) => ({ id: `vertical-tab-${index}` });

    private handleOpenAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    private handleCloseAccountMenu = () => {
        this.setState({ anchorEl: null });
    };

    private handleLogout = () => {
        this.props.onUserLogout();
        this.props.history.push('/');
    };

    private handleChangeTab = (event: any, newValue: number) => {
        this.setState({ tabValue: newValue });
    };

    private handleClick = (tabName: string, callback?: () => void) => () => {
        this.props.history.push(`/home#${tabName}`);
        if (callback) {
            callback();
        }
    };

    private renewCategoryTabKey = () => {
        this.setState({ categoryTabKey: Date.now() });
    };

    public render() {
        const { userSession, authToken } = this.props;
        const { anchorEl, tabValue, categoryTabKey } = this.state;

        return (
            <div className={theme.fullContainer}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <div className={theme.hiddenSpan} />
                        {userSession !== null
                            && <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={this.handleOpenAccountMenu}
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={!!anchorEl}
                                    onClose={this.handleCloseAccountMenu}
                                >
                                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        }
                    </Toolbar>
                </AppBar>
                <div className={theme.centerContent}>
                    <Container component="main" maxWidth="xl" className={theme.mainContainer}>
                        <Paper className={theme.mainPaper}>
                            {userSession !== null
                                && <div className={theme.root}>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={tabValue}
                                        onChange={this.handleChangeTab}
                                        className={theme.verticalTabs}
                                        centered={false}
                                        indicatorColor="primary"
                                    >
                                        <CustomTab label="Overview" {...this.a11yProps(0)} onClick={this.handleClick('')} />
                                        <CustomTab label="Categories" {...this.a11yProps(1)} onClick={this.handleClick('categories', this.renewCategoryTabKey)} />
                                        <CustomTab label="Products" {...this.a11yProps(2)} onClick={this.handleClick('products')} />
                                        <CustomTab label="Account" {...this.a11yProps(3)} onClick={this.handleClick('account')} />
                                        <CustomTab label="Change password" {...this.a11yProps(4)} onClick={this.handleClick('change-password')} />
                                    </Tabs>
                                    <TabPanel value={tabValue} index={0}>
                                        <Overview authToken={authToken!} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <Categories authToken={authToken!} key={categoryTabKey} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                        <Products authToken={authToken!} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={3}>
                                        <AccountOverview userSession={userSession} authToken={authToken!} />
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={4}>
                                        <ChangePassword userSession={userSession} authToken={authToken!} />
                                    </TabPanel>
                                </div>
                            }
                        </Paper>
                    </Container>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    authToken: getAuthToken(state.authentication),
    userSession: getUserSession(state.user)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onUserLogout: () => dispatch(userLogout())
});

export const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
