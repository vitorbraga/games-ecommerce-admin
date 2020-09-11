import * as React from 'react';
import { History, LocationState } from 'history';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { User } from '../../modules/user/model';
import { AccountOverview } from './account';
import { ResultMessageBox } from '../../widgets/result-message-box';
import { Overview } from './overview';
import { Categories } from './categories/categories';
import { Products } from './products/products';

import * as theme from './home.scss';

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

interface HomeProps {
    authToken: string | null;
    user: User | null;
    setUser: (user: User | null) => void;
    userLogout: () => void;
    history: History<LocationState>;
}

interface HomeState {
    loading: boolean;
    anchorEl: Element | null;
    tabValue: number;
    error: string;
    categoryTabKey: number;
}

interface TabPanelProps extends TypographyProps {
    value: number;
    index: number;
    children: React.ReactNode;
}

type TabsKeys = '' | 'account' | 'categories' | 'products';

const tabsMapper = {
    '': 0,
    'categories': 1,
    'products': 2,
    'account': 3
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

export class Home extends React.PureComponent<HomeProps, HomeState> {
    public state: HomeState = {
        loading: false,
        anchorEl: null,
        tabValue: getTabValue(),
        error: '',
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
        this.props.userLogout();
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
        const { user, authToken } = this.props;
        const { loading, anchorEl, tabValue, error, categoryTabKey } = this.state;

        return (
            <div className={theme.fullContainer}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <div className={theme.hiddenSpan} />
                        {user !== null
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
                {loading
                    ? <div className={theme.loadingBox}>
                        <CircularProgress size={60} />
                    </div>
                    : <div className={theme.centerContent}>
                        <Container component="main" maxWidth="xl" className={theme.mainContainer}>
                            <Paper className={theme.mainPaper}>
                                {error && <ResultMessageBox type="error" message={error} />}
                                {user !== null
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
                                        </Tabs>
                                        <TabPanel value={tabValue} index={0}>
                                            <Overview />
                                        </TabPanel>
                                        <TabPanel value={tabValue} index={1}>
                                            <Categories authToken={authToken!} key={categoryTabKey} />
                                        </TabPanel>
                                        <TabPanel value={tabValue} index={2}>
                                            <Products authToken={authToken!} />
                                        </TabPanel>
                                        <TabPanel value={tabValue} index={3}>
                                            <AccountOverview user={user} />
                                        </TabPanel>
                                    </div>
                                }
                            </Paper>
                        </Container>
                    </div>
                }
            </div>
        );
    }
}
