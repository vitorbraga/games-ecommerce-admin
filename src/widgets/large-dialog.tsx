import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';

import * as theme from './large-dialog.scss';

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
}

export const LargeDialog: React.FC<Props> = ({ open, title, onClose, children }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle disableTypography className={theme.dialogTitle}>
                <Typography component="h6" variant="h6">
                    {title}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
};
