import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
// import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import BoardList from '../BoardList/index';
import NavBar from '../NavBar/index'
import CreateBoardDialog from '../Dialog/CreateBoardDialog/index'
import { CardHeader, Button, SnackbarContent } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  floatLeft: {
    float: "left",
  },
  paperLikeShadow: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  }
}));

export { useStyles };

export default function Dashboard() {
  const classes = useStyles();
  const [boardList, setBoardList] = useState([]);
  const [showSnackbar, setshowSnackBar] = useState(false);
  const history = useHistory();

  const handleShowSnackbar = () => {
    setshowSnackBar(true);
  };

  const addBoardToList = (newBoard) => {
    const boardListCopy = boardList.slice();
    setBoardList(boardListCopy.concat([newBoard]));
  }

  const removeBoard = (id) => {
    const boardListCopy = boardList.slice();
    // alert(id)
    // console.log(boardListCopy)
    for (let i = 0; i < boardListCopy.length; i++) {
      if (boardListCopy[i].boardID === id) {
        boardListCopy.splice(i, 1);
        break;
      }
    }
    // console.log(boardListCopy)
    setBoardList(boardListCopy);
  }

  useEffect(() => {
    const jwtToken = window.localStorage.getItem('jwtToken');
    const userID = window.localStorage.getItem('userID');
    const token = "Bearer " + jwtToken;
    fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/${userID}`, {
      method: 'GET',
      headers: {
        Authorization: token,
        // 'Authorization' : `Bearer ${token}`
      },
    }).then(res => {
      if (res.status === 200) {
        res.json()
          .then(result => {
            // console.log(window.localStorage.getItem('userID'))
            setBoardList(result);
            // console.log(boardList)

          })
      } else if (res.status === 401) {
        //chưa có quyền thì về trang đăng nhập
        history.push('/signin')
      }
    }).catch(
      err => console.log(err)
    )
  }, [history]);

  return (
    <>
      <CssBaseline />
      <NavBar userName={localStorage.getItem('userName')} />
      <main>
        {/* Hero unit */}
        <SimpleSnackbar open={showSnackbar} setOpen={(isOpen) => setshowSnackBar(isOpen)} />

        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <div style={{ borderStyle: "solid", borderWidth: 5, borderColor: "#3f51b5" }}>
              <Typography style={{ marginTop: 15, color: "#3f51b5" }} component="h3" variant="h3" align="center" color="textPrimary" >
                Your boards
            </Typography>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                className={[classes.card, classes.paperLikeShadow].join(" ")} //multiple class
                style={{ backgroundColor: '#fafafa' }}
              >
                <CardContent align="center" >
                  <CardHeader>
                  </CardHeader>
                  <CreateBoardDialog addBoard={(newBoard) => addBoardToList(newBoard)} />
                </CardContent>
              </Card>
            </Grid>
            <BoardList handleShowSnackbar={() => handleShowSnackbar} boardList={boardList} classes={classes} removeBoard={(id) => removeBoard(id)} />
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          My Retro
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Contact: lactuanminh2121@gmail.com!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </>
  );
}


function SimpleSnackbar({ open, setOpen }) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const styles = {
    snackbarBackground: {
      backgroundColor: "orange",
    }
  }

  return (
    <div>
      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}

      >
        <SnackbarContent
          message={
            <Typography variant='h6'>Copied board's URL to clipboard</Typography>
          }
          style={{ backgroundColor: 'green' }} />
      </Snackbar>
    </div>
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


