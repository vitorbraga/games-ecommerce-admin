import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<Props> = ({ open, onClose, onConfirm, children }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    No
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
