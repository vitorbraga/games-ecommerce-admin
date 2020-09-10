import * as React from 'react';
import classNames from 'classnames';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import * as theme from './result-message-box.scss';

interface ResultMessageBoxProps {
    type: 'success' | 'error' | 'warning';
    message?: string;
    onClose?: () => void;
}

export const ResultMessageBox: React.SFC<ResultMessageBoxProps> = ({ message, type, children, onClose }) => {
    return (
        <Box mt={2} mb={2} className={classNames(theme.resultMessageBox, theme[type])}>
            {children || <span>{message}</span>}
            {onClose &&
                <IconButton title="close" size="small" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            }
        </Box>
    );
};
