import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { isBlankString } from '../../../utils/index'
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';


export default function CreateTagDialog({ boardID, colTypeID, tags, setTags }) {
    const [open, setOpen] = useState(false);
    const [tagContent, setTagContent] = useState("");
    // const [description, setDiscription] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddTag = async () => {
        // alert(colTypeID)
        if (colTypeID === 0) {
            alert('Wait for a moment and try again');
            return;
        }
        if (isBlankString(tagContent)) {
            alert('Tag content cannot be empty');
            return;
        }
        const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/addtag/${boardID}`, {
            method: 'POST',
            body: JSON.stringify({ tagContent, colTypeID }),
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();

        if (res.status === 200) {
            console.log(result.newTag);
            const tagsCopy = tags.slice();
            setTags(tagsCopy => tagsCopy.concat([{ ...result.newTag }]));
            handleClose();
        } else if (res.status === 400) { // blank content
            alert(result.mesg)
        } else if (res.status === 500) { //server error
            alert(result.mesg);
        }
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <AddIcon />
            </IconButton>
            <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Typography component="h4" variant="h5" align="center" color="textPrimary" gutterBottom>
                        New tag
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText> */}
                    {/* <Typography component="h2"> Name: </Typography> */}
                    <textarea
                        autoFocus
                        margin="dense"
                        label="Tag Content"
                        rows="4"
                        onChange={(event) => setTagContent(event.target.value)}
                        style={{ fontSize: '16px', overflowY: 'scroll', overflowWrap: 'break-word', resize: 'none', width: '99%', height: 'auto' }}
                    />
                    {/* <Typography component="h2"> Description: </Typography> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddTag} variant="outlined" color="secondary">
                        Add
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
