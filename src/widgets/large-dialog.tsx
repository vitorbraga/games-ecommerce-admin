import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import * as theme from './large-dialog.scss';
import { Typography } from '@material-ui/core';

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
}

export class LargeDialog extends React.PureComponent<Props, never> {
    public render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle disableTypography className={theme.dialogTitle}>
                    <Typography component="h6" variant="h6">
                        {this.props.title}
                    </Typography>
                    <IconButton onClick={this.props.onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {this.props.children}
                </DialogContent>
            </Dialog>
        );
    }
}
