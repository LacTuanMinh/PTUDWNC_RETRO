import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { Button, Grid, } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useStyles } from '../DashBoard/index'

export default function NavBar({ userName }) {
    // const info = window.localStorage.getItem('userName');
    // const [userName, setUserName] = useState(userName);

    let history = useHistory();
    const classes = useStyles();
    const smMargin = {
        marginLeft: 5,
        marginRight: 5
    }
    const handleLogout = () => {
        console.log(window.localStorage);
        window.localStorage.clear();
        console.log(window.localStorage)

        history.push("/signin");
    }

    const handleLogin = () => {
        history.push("/signin");
    }
    const handleProfileClick = () => {
        history.push("/profile");
    }
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Grid
                        justify="space-between" container align="center" display="flex"
                    >
                        <Grid >
                            <Typography variant="h6" color="inherit" noWrap>

                                <Link to="/dashboard" style={{ textDecoration: 'none', color: "white" }}>
                                    <AssignmentIcon className={classes.icon} style={{ marignTop: '5px', marginBottom: '-10px', fontSize: '32px' }} /><span style={{ fontSize: '25px', textDecoration: 'underline' }}>My Retro</span>
                                </Link>
                            </Typography>
                        </Grid>

                        <Grid item>

                            {
                                userName ?
                                    <>
                                        <Button style={{ ...smMargin, textTransform: 'none' }} onClick={() => handleProfileClick()} variant="contained" color="secondary" >
                                            <AccountCircleIcon style={smMargin} /><b> {userName}</b>
                                        </Button>
                                        <Button style={{ ...smMargin, textTransform: 'none' }} onClick={() => handleLogout()} variant="contained" m={10} color="secondary"><b>Log out</b></Button>
                                    </>
                                    :
                                    <Button onClick={() => handleLogin()} style={{ ...smMargin, textTransform: 'none' }} variant="contained" m={10} color="secondary" ><b>Sign in</b></Button>

                            }

                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    )
}