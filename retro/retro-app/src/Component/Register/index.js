import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { isBlankString } from '../../utils/index'


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Register() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const history = useHistory();
    const classes = useStyles();

    const onSubmit = (event) => {
        event.preventDefault();
        // console.log(userName);
        // console.log(password + " " + verifyPassword)
        if (isBlankString(userName) || isBlankString(password) || isBlankString(verifyPassword)) {
            alert('Some fields are a blank string');
            return;
        }
        if (password !== verifyPassword) {
            alert("Confirm password does not match")
            return;
        }
        fetch('https://us-central1-retro-api-5be5b.cloudfunctions.net/app/register', {
            method: 'POST',
            body: JSON.stringify({ userName, password, verifyPassword }),
            headers: {
                'Content-Type': 'application/json'
                // Authorization: token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(result => {
                        alert(result.mesg);
                        // console.log(result.token);
                        // console.log(result.id)
                        // console.log(result.name)

                        window.localStorage.setItem('jwtToken', result.token);
                        window.localStorage.setItem('userID', result.id);
                        window.localStorage.setItem('userName', result.name);
                        history.push("/dashboard");
                    });
                } else if (res.status === 400) {
                    res.json().then(result => {
                        alert(result.mesg);
                    });
                }
            }).catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    useEffect(() => {
        const jwtToken = window.localStorage.getItem('jwtToken');
        // const userID = window.localStorage.getItem('userID');
        fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/authenticate`, {
            method: 'POST',
            // body: JSON.stringify({ newUserName }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }).then(res => {
            if (res.status === 200) {
                history.push('/dashboard');
            }
            if (res.status === 401) {
                // stay this site
            }
        })
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>

                <form className={classes.form} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="userName"
                                variant="outlined"
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                // autoComplete="userName"
                                autoFocus
                                onChange={(event) => setUserName(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                type="password"
                                // autoComplete="current-password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="verifyPassword"
                                label="Verify Password"
                                type="password"
                                id="verifyPassword"
                                // autoComplete="current-password"
                                onChange={(event) => setVerifyPassword(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Register
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/signin" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>

        </Container>
    );
}