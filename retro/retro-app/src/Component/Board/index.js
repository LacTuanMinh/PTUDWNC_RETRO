import React from 'react'
// import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import LinkIcon from '@material-ui/icons/Link'; import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RemoveBoardDialog from '../Dialog/RemoveBoardDialog/index';
import { useHistory } from "react-router-dom";

export default function Board(props) {
    const history = useHistory();

    const redirectToDetail = () => {
        history.push({
            pathname: `/dashboard/boardcontent/${props.board.boardID}`,
            // boardInfo: props.board
        });
    }

    const handleCopyURL = () => {
        // alert(props.board.boardID);
        props.handleShowSnackbar();
        const url = window.location.href + `/boardcontent/${props.board.boardID}`;
        let textArea = document.createElement("textarea");
        textArea.value = url;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
    return (
        <>
            <Grid item key={props.board.boardID} xs={12} sm={6} md={3}>
                <Card style={{ position: 'relative' }} className={props.classes.card} >
                    <CardMedia
                        className={props.classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                    />
                    <CardContent className={props.classes.cardContent}>
                        <Typography
                            // style={{
                            //     whiteSpace: 'nowrap',
                            //     width: '95%',
                            //     overflow: 'hidden',
                            //     textOverflow: 'ellipsis'
                            // }}
                            gutterBottom variant="h6" component="h">
                            <b>{props.board.boardName}</b>
                        </Typography>
                        <Typography>
                            {props.board.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button style={{ fontSize: '13px' }} onClick={() => redirectToDetail()} variant="outlined" size="medium" color="secondary"> View detail </Button>
                        <RemoveBoardDialog removeBoard={(id) => props.removeBoard(id)} align="right" boardID={props.board.boardID} boardName={props.board.boardName} />
                    </CardActions>
                    <Button
                        // color="secondary"
                        title="Click to get URL"
                        variant="contained"
                        onClick={() => handleCopyURL()}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            alignContent: 'center',
                            fontSize: '4',
                            borderRadius: '50%',
                            height: '65px',
                            width: '67px',
                            color: '#FFF',
                            backgroundImage: 'linear-gradient(to right, #24C6DC 0%, #514A9D 100%)',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}
                    >
                        <LinkIcon fontSize='large' style={{ marginRight: '2' }} />
                    </Button>
                </Card>
            </Grid>
        </>
    );
}