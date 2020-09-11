import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export enum SnackbarTypeEnum {
    error = 'error',
    success = 'success',
    warning = 'warning',
    info = 'info'
}

export type SnackbarType = keyof typeof SnackbarTypeEnum;

interface Props {
    open: boolean;
    message: string;
    type: SnackbarType;
    onClose: () => void;
}

export const CustomSnackbar: React.FC<Props> = (props: Props) => {
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={6000}
            onClose={props.onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={props.onClose} severity={props.type}>
                {props.message}
            </Alert>
        </Snackbar>
    );
};
