import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { isBlankString } from '../../../utils/index'
import AddIcon from '@material-ui/icons/Add';

export default function FormDialog({ addBoard }) {
    const [open, setOpen] = useState(false);
    const [boardName, setBoardName] = useState("");
    const [description, setDiscription] = useState("");
    const history = useHistory();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddBoard = (event) => {
        event.preventDefault();
        if (isBlankString(boardName)) {
            alert('Board name cannot be empty');
            return;
        }
        const userID = localStorage.getItem('userID');
        const token = window.localStorage.getItem('jwtToken')
        fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/createboard/${userID}`, {
            method: 'POST',
            body: JSON.stringify({ boardName, description }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                alert('You have to sign in before creating a board!');
                history.push('/signin');
            } else if (res.status === 200) {
                res.json().then(result => {
                    // alert(result.mesg);// create successfully

                    console.log(result.newBoard);
                    addBoard(result.newBoard);
                    // console.log(result.id)
                    // console.log(result.name)
                    // window.localStorage.setItem('jwtToken', result.token);
                    // window.localStorage.setItem('userID', result.id);
                    // window.localStorage.setItem('userName', result.name);
                    // history.push("/dashboard");
                    handleClose();
                });
            } else if (res.status === 400) {// blank content
                res.json().then(result => alert(result.mesg))
            }
            else if (res.status === 500) {// server error
                res.json().then(result => {
                    alert(result.mesg);
                })
            }
        }).catch(err => {
            console.error(err);
            alert('Error create board please try again');
        });
    };

    return (
        <div>
            <Button style={{ alignContent: 'center', display: 'block', maxWidth: 'auto', maxHeight: '50%', minWidth: 'auto', minHeight: '50%' }}
                size="large" variant="contained" color="secondary" onClick={handleClickOpen}
            >
                <div >
                    <AddIcon />
                </div>
                <div>
                    <Typography>Create</Typography>
                </div>
            </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom>
                        Create board
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText> */}
                    {/* <Typography component="h2"> Name: </Typography> */}
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="boardName"
                        name="boardName"
                        label="Board name"
                        fullWidth
                        onChange={(event) => setBoardName(event.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Short description"
                        fullWidth
                        onChange={(event) => setDiscription(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleAddBoard} color="secondary">
                        Create
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
