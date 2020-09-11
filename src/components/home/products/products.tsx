import * as React from 'react';
import { ProductList } from './product-list';
import { CreateProduct } from './create-product';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import * as theme from './products.scss';
import Box from '@material-ui/core/Box';

interface Props {
    authToken: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        'id': `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export const Products: React.FC<Props> = ({ authToken }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <div className={theme.contentBox}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="List of products" {...a11yProps(0)} />
                    <Tab label="Create product" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={selectedTab} index={0}>
                <div className={theme.productList}>
                    <ProductList authToken={authToken} />
                </div>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <div className={theme.createProduct}>
                    <CreateProduct authToken={authToken} />
                </div>
            </TabPanel>
        </div>
    );
};
