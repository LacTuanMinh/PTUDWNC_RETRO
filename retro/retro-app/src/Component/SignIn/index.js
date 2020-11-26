import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    let history = useHistory();

    useEffect(() => {
        const Script = document.createElement('script');
        Script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v9.0&appId=384191462701845&autoLogAppEvents=1";
        Script.async = true;
        Script.defer = true;
        Script.crossOrigin = "anonymous";
        Script.nonce = "IUpMdMLd";
        document.body.insertBefore(Script, document.body.firstChild);

        const Div = document.createElement('div');
        Div.id = "fb-root";
        document.body.insertBefore(Div, document.body.firstChild);

        // window.fbIn
    })

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
            if (res.status === 200) {
                history.push('/dashboard');
            }
            if (res.status === 401) {
                // stay this site
            }
        })
    }, [])

    const handleSignIn = (event) => {
        event.preventDefault();
        // const jwtToken = window.localStorage.getItem('jwtToken');
        // const token = "Bearer " + jwtToken;
        fetch('https://my-retro-api.herokuapp.com/signIn', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: {
                'Content-Type': 'application/json'
                // Authorization: token
            }
        }).then(res => {
            if (res.status === 200) {
                res.json().then(result => {
                    // alert(result.mesg);
                    // console.log(result.token);
                    // console.log(result.id)
                    // console.log(result.name)

                    window.localStorage.setItem('jwtToken', result.token);
                    window.localStorage.setItem('userID', result.id);
                    window.localStorage.setItem('userName', result.name);
                    history.push("/dashboard");
                });
            } else {
                res.json().then(result => {
                    alert(result.mesg);
                });
            }
        }).catch(err => {
            console.error(err);
            alert('Error logging in please try again');
        });
    }

    // const handleFaceBookLogin = async (event) => {
    //     event.preventDefault();
    //     const res = await fetch('https://my-retro-api.herokuapp.com/auth/facebook', {
    //         method: 'GET',
    //         // credentials: "include",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Credentials": true
    //         }
    //     })
    //     // const result = await res.json();
    //     console.log(res.data);

    // }
    return (
        <>
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            My Retro
                        </Typography>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form onSubmit={handleSignIn} className={classes.form}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                name="userName"
                                autoComplete="userName"
                                autoFocus
                                onChange={(event) => setUserName(event.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                Sign In
                            </Button>

                        </form>

                        {/* <Button onClick={handleFaceBookLogin} class="fb-login-button" data-size="large" data-button-type="login_with" data-layout="default" data-use-continue-as="true" data-width=" "></Button>

                        <a href="https://my-retro-api.herokuapp.com/auth/facebook">
                            Sign in with facebook
                            </a> */}
                        <Grid container style={{ margin: '15px', alignContent: 'center' }}>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Register"}
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}