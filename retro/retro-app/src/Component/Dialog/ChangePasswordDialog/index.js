import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import { isBlankString } from '../../../utils/index'; //'../../../utils/index'

export default function FormDialog() {
    const [open, setOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("")
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        // console.log(currentPassword)
        if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
            alert('Please fill out all these fields')
            return;
        } else if (isBlankString(currentPassword) || isBlankString(newPassword) || isBlankString(confirmPassword)) {
            alert('Some fields are a blank string')
            return;
        } else if (newPassword !== confirmPassword) {
            alert('Confirm password does not match')
            return;
        }

        const userID = localStorage.getItem('userID');
        const token = window.localStorage.getItem('jwtToken')
        fetch(`https://my-retro-api.herokuapp.com/profile/password/${userID}`, {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                res.json().then(result => {
                    alert(result.mesg);
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
            alert('Error change password please try again');
        });
    };

    return (
        <div>
            <Button fullWidth variant="outlined" color="secondary" onClick={handleClickOpen} startIcon={<SaveIcon />}>
                Change password
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form >
                    <DialogTitle id="form-dialog-title">Change password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="currentPassword"
                            name="currentPassword"
                            label="Current password"
                            type="password"
                            fullWidth
                            onChange={(event) => { setCurrentPassword(event.target.value); }}
                        />
                        <TextField

                            margin="dense"
                            id="newPassword"
                            name="newPassword"
                            label="New password"
                            type="password"
                            fullWidth
                            onChange={(event) => { setNewPassword(event.target.value); }}
                        />
                        <TextField

                            margin="dense"
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm password"
                            type="password"
                            fullWidth
                            onChange={(event) => { setConfirmPassword(event.target.value); }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button /*onClick={handleClose}*/ onClick={handleChangePassword} color="secondary">
                            Update
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>

                    </DialogActions>
                </form>

            </Dialog>
        </div>
    );
}
