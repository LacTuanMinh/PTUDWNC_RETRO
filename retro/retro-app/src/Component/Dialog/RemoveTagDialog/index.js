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
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

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

export default function CustomizedDialogs({ tag, tags, setTags }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveTag = async (event) => {
        event.preventDefault();
        const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/removetag/${tag.boardID}`, {
            method: 'POST',
            body: JSON.stringify({ tagID: tag.tagID }),
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();
        if (res.status === 200) {
            // alert(result.mesg);
            const tagsCopy = tags.slice();
            const tagIDToRemove = result.tagID;
            for (let i = 0; i < tagsCopy.length; i++) {
                if (tagsCopy[i].tagID === tagIDToRemove) {
                    tagsCopy.splice(i, 1);
                    break;
                }
            }
            setTags(tagsCopy);
        }
        else if (res.status === 500) {// authenticate thất bại tự trả 401
            alert(result.mesg)
        }
        setOpen(false);
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen} title="Warning: you will  delete this tag" ><DeleteOutlineIcon style={{ fontSize: 'small' }} /></IconButton>
            <Dialog fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" >
                    Warning
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Verify to remove this tag
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemoveTag} color="secondary">
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
