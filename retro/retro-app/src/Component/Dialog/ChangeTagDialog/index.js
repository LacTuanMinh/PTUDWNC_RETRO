import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { isBlankString } from '../../../utils/index'
import EditIcon from '@material-ui/icons/Edit';

import { IconButton } from '@material-ui/core';


export default function ChangeTagDialog({ tags, tag, setTags }) {
    const [open, setOpen] = useState(false);
    const [newTagContent, setNewTagContent] = useState(tag.tagContent);

    const handleClickOpen = () => {
        setNewTagContent(tag.tagContent);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTag = async () => {
        // alert(colTypeID)
        // if (colTypeID === 0) {
        //     alert('Wait for a moment and try again');
        //     return;
        // }
        if (isBlankString(newTagContent)) {
            alert('Content is blank string');
            return;
        }
        const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/edittag/${tag.boardID}`, {
            method: 'POST',
            body: JSON.stringify({ tagContent: newTagContent, tagID: tag.tagID }),
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();
        if (res.status === 200) {
            // alert(result.mesg);

            //find tag and replace
            const tagsCopy = tags.slice();
            setTags(tagsCopy.map(item => {
                if (item.tagID !== tag.tagID)
                    return item;
                else {
                    return { ...item, tagContent: result.tagContent }
                }
            }));
            setNewTagContent(result.tagContent)
            handleClose();
        } else if (res.status === 500) {
            alert(result.mesg);
            handleClose();
        }
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}><EditIcon style={{ fontSize: 'small' }} /></IconButton>
            <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {/* <DialogTitle id="form-dialog-title">
                    <Typography component="h4" variant="h5" align="center" color="textPrimary" gutterBottom>
                        {tagContent}
                    </Typography>
                </DialogTitle> */}
                <DialogContent>
                    <textarea
                        value={newTagContent}
                        autoFocus
                        margin="dense"
                        label="Tag Content"
                        rows="4"
                        onChange={(event) => setNewTagContent(event.target.value)}
                        style={{ fontSize: '16px', overflow: 'hidden', overflowWrap: 'break-word', resize: 'none', width: '99%', height: 'auto' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangeTag} variant="outlined" color="secondary">
                        Update
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
