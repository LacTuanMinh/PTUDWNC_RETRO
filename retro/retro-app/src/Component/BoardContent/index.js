import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import NavBar from '../NavBar/index';
import ContentBody from './contentBody';
import ChangeBoardInfo from './changeBoardInfo'


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

    //used to fetch data
    useEffect(() => {

        async function fetchData() {
            const boardID = props.match.params.boardid;
            const res = await fetch(`http://localhost:8000/boards/boardcontent/${boardID}`, {
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
