import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
// import { makeStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import FolderIcon from '@material-ui/icons/Folder';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Input from '@material-ui/core/Input';
// import EditIcon from '@material-ui/icons/Edit';
// import SaveIcon from '@material-ui/icons/Save';
import NavBar from '../NavBar/index';
import ContentBody from './contentBody';
import ChangeBoardInfo from './changeBoardInfo'
// import { Button, TextField } from '@material-ui/core';


export default function BoardContent(props) {
    const history = useHistory();
    const [board, setBoard] = useState({
        boardID: "",
        boardName: "",
        description: "",
        userID: ""
    });
    const [tags, setTags] = useState([]);
    const [columnType, setColumnType] = useState([{}]);

    useEffect(() => {
        async function fetchData() {
            const boardID = props.match.params.boardid;
            const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/${boardID}`, {
                method: 'GET'
            });
            const result = await res.json();
            if (res.status === 200) {
                setBoard(result.board);
                setTags(result.tags);
                setColumnType(result.columnType)
                // console.log(result.tags) //log ko có gì hết
            } else if (res.status === 500) {
                alert(result.mesg)
                history.push('/dashboard');
            }
        }
        fetchData();
    }, [history, props.match.params.boardid]);

    // console.log(tags) // log ra dc
    return (
        <>
            <NavBar userName={localStorage.getItem('userName')} />
            <ChangeBoardInfo
                board={board}
                setBoard={(board) => setBoard(board)}
            />
            <ContentBody
                boardID={board.boardID}
                columnType={columnType}
                tags={tags}
                setTags={(tags) => setTags(tags)}
            />
        </>
    );
}

