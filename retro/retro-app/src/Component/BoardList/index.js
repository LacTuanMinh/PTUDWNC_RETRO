import React from 'react';
import Board from '../Board/index'


export default function BoardList(props) {
    console.log(props.boardList)
    return (
        <>
            {
                props.boardList.map((item) => (
                    <Board
                        key={item.boardID}
                        board={item}
                        classes={props.classes}
                        removeBoard={(id) => props.removeBoard(id)}
                        handleShowSnackbar={props.handleShowSnackbar()}
                    />
                ))
            }
        </>
    );
}