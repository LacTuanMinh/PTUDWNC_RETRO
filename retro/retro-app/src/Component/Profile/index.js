import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';
import ChangePasswordDialog from '../Dialog/ChangePasswordDialog/index';
import NavBar from '../NavBar/index';
import { isBlankString } from '../../utils/index';
import { useHistory } from "react-router-dom";

// import {useStyles as dashboardStyles} from '../DashBoard/index'


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "black"//theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    floatRight: {
        float: "right",
    }
}));

export default function SignIn() {
    const classes = useStyles();
    const [userName, setUserName] = useState(localStorage.getItem('userName'))
    const [newUserName, setNewUserName] = useState(localStorage.getItem('userName'));

    const history = useHistory();

    useEffect(() => {
        const jwtToken = window.localStorage.getItem('jwtToken');
        // const userID = window.localStorage.getItem('userID');
        fetch(`https://my-retro-api.herokuapp.com/authenticate`, {
            method: 'POST',
            // body: JSON.stringify({ newUserName }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }).then(res => {
            if (res.status === 401) {
                // alert("You have to log in")
                history.push('/signin')
            }
        })
    })

    const handleUserNameChange = (event) => {
        event.preventDefault();
        if (isBlankString(newUserName)) {
            alert('User name is a blank string')
            return;
        } else if (newUserName === userName) {
            alert('User name hasn\'t been changed')
            return;
        }
        const userID = localStorage.getItem('userID');
        const token = window.localStorage.getItem('jwtToken')
        fetch(`https://my-retro-api.herokuapp.com/profile/username/${userID}`, {
            method: 'POST',
            body: JSON.stringify({ newUserName }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(result => {

                        alert(result.mesg);
                        setUserName(result.userName);
                        window.localStorage.setItem('userName', result.userName);

                    });
                } else if (res.status === 400) {// error : wrong id
                    res.json().then(result => {
                        alert(result.mesg);
                    });
                } else if (res.status === 401) {
                    alert("You have to log in")
                    history.push('/signin')
                }
            }).catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    };
    return (
        <>
            <NavBar userName={userName} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <ContactMailRoundedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        YOUR PROFILE
                    </Typography>
                    <form className={classes.form} onSubmit={handleUserNameChange}>
                        <Typography component="h2"> Name: </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            // label="User Name"
                            name="userName"
                            placeholder="User name"
                            defaultValue={userName}
                            onChange={(event) => { setNewUserName(event.target.value); }}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            className={classes.submit}
                            startIcon={<SaveIcon />}
                        // action
                        >
                            Update name
                        </Button>
                        <Typography component="h2" style={{ marginTop: 10, marginBottom: 12 }}> Passowrd: </Typography>
                        <ChangePasswordDialog />
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}