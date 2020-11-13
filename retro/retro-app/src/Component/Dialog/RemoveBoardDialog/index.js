import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs({ boardID, boardName, removeBoard }) {
    const [open, setOpen] = useState(false);
    // const [boardID, setBoardID] = useState(boardID);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveBoard = (event) => {
        event.preventDefault();
        const token = window.localStorage.getItem('jwtToken')
        fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/removeboard/${boardID}`, {
            method: 'POST',
            body: JSON.stringify({ boardID }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 200) {
                res.json().then(result => {
                    // alert(result.mesg);
                    removeBoard(result.boardID);

                    // console.log(result.token);
                    // console.log(result.id)
                    // console.log(result.name)

                    // window.localStorage.setItem('jwtToken', result.token);
                    // window.localStorage.setItem('userID', result.id);
                    // window.localStorage.setItem('userName', result.name);
                    // history.push("/dashboard");
                });
            } else if (res.status === 401) {// authenticate thất bại tự trả 401
                alert("You have to log in")
            }
        }).catch(err => {
            console.error(err);
            alert('Error logging in please try again');
        });
        setOpen(false);
    };

    return (
        <div>
            <Button style={{ fontSize: 6 }} size="small" color="primary" onClick={handleClickOpen}>
                Delete board
            </Button>
            <Dialog fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" >
                    Warning
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Verify to remove <b>'{boardName}'</b>
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemoveBoard} color="secondary">
                        Remove
                    </Button>
                    <Button autoFocus variant="contained" onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
