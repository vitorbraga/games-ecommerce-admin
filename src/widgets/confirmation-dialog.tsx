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

export class ConfirmationDialog extends React.PureComponent<Props, never> {
    public render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogContent>
                    <DialogContentText>
                        {this.props.children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        No
                    </Button>
                    <Button onClick={this.props.onConfirm} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
