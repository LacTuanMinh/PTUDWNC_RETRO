import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import { isBlankString } from '../../utils/index';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function Inputs({ board, setBoard }) {

    const classes = useStyles();
    const [nameEditorDisplay, setNameEditorDisplay] = useState(false);
    const [descEditorDisplay, setDescEditorDisplay] = useState(false);
    const [newBoardName, setNewBoardName] = useState(board.boardName);
    const [newDesc, setNewDesc] = useState(board.description);

    const handleNameEditorClose = () => {
        setNewBoardName(board.boardName);
    }

    const handleDescEditorClose = () => {
        setNewDesc(board.description);
    }

    useEffect(() => {
        setNewBoardName(board.boardName);
        setNewDesc(board.description)
    }, [board])

    const handleBoardNameChange = (event) => {
        event.preventDefault()
        async function updateBoardName() {
            if (isBlankString(newBoardName)) {
                alert('Board name cannnot be empty');
                return;
            }
            const boardID = board.boardID;
            const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/changename/${boardID}`, {
                method: 'POST',
                body: JSON.stringify({ newBoardName }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await res.json();
            if (res.status === 200) {
                // alert(result.mesg);
                setBoard({ ...board, boardName: result.newBoardName });
                setNameEditorDisplay(false);
            } else if (res.status === 500) {
                alert(result.mesg);
                setNameEditorDisplay(false);
                setNewBoardName(board.boardName)
                return;
            }
        }
        updateBoardName();
    }

    const handleDescChange = (event) => {
        event.preventDefault()
        async function updateDescription() {
            const boardID = board.boardID;
            const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/changedescription/${boardID}`, {
                method: 'POST',
                body: JSON.stringify({ newDesc }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await res.json();
            if (res.status === 200) {
                // alert(result.mesg);
                setBoard({ ...board, description: result.newDescription });
                setDescEditorDisplay(false)
            } else if (res.status === 500) {
                alert(result.mesg);
                setDescEditorDisplay(false);
                setNewDesc(board.boardName)
                return;
            }
        }
        updateDescription();
    }
    return (
        <div style={{ display: 'inline-block', marginTop: 3, marginBottom: 5, marginLeft: 40 }} className={classes.root} autoComplete="off">
            <div style={{ float: 'left', margin: '20px' }}>
                <Input
                    style={{ width: 'auto', fontSize: 25, fontWeight: 'bold' }}
                    required
                    value={newBoardName}
                    onChange={(event) => { setNewBoardName(event.target.value) }}
                    placeholder="Board name"
                    readOnly={nameEditorDisplay === false}
                />
                {
                    nameEditorDisplay === false
                        ?
                        <IconButton onClick={() => setNameEditorDisplay(true)} style={{ margin: '0' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        :
                        <>
                            <IconButton onClick={handleBoardNameChange} style={{ margin: '0' }}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => { setNameEditorDisplay(false); handleNameEditorClose(); }} style={{ margin: '0' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                }
            </div>

            <div style={{ float: 'left', margin: '20px' }}>
                <Input
                    value={newDesc}
                    onChange={(event) => { setNewDesc(event.target.value) }}
                    placeholder="Description" inputProps={{ 'aria-label': 'description' }}
                    disabled={descEditorDisplay === false}
                    style={{ fontSize: 20 }}
                />
                {
                    descEditorDisplay === false ?
                        <IconButton onClick={() => setDescEditorDisplay(true)} style={{ margin: '0' }}> <EditIcon fontSize="small" /></IconButton> :
                        <>
                            <IconButton onClick={handleDescChange} style={{ margin: '0' }}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => { setDescEditorDisplay(false); handleDescEditorClose() }} style={{ margin: '0' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                }
            </div>
        </div>
    );
}