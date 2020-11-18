import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Badge, Grid } from '@material-ui/core';
import CreateTagDialog from '../Dialog/CreateTagDialog';
import ChangeTagDialog from '../Dialog/ChangeTagDialog';
import RemoveTagDialog from '../Dialog/RemoveTagDialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(0),
    },
    tagContent: {
        margin: theme.spacing(1, 0, 0),
        padding: theme.spacing(1),
        textAlign: 'left',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        borderRadius: '5px',
    },
    paperLikeShadow: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    }

}));


// this Tag component is used in Body component below
function Tag({ tags, tag, index, setTags, color }) { // tags: toàn bộ tag cũa board
    const classes = useStyles();
    return (
        <Draggable draggableId={tag.tagID} index={index} >
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className={classes.tagContent}
                        style={{ backgroundColor: color, display: 'inline-block', width: '95%' }}>
                        <div style={{ whiteSpace: "pre-wrap", wordWrap: 'break-word', float: 'left', width: '87%', fontSize: '18px', paddingTop: '5px', paddingBottom: '5px' }}>
                            {tag.tagContent}
                        </div>

                        <div style={{ float: 'right', width: '13%' }}>
                            <ChangeTagDialog tag={tag} tags={tags} setTags={(tag) => setTags(tag)} />
                            <RemoveTagDialog tag={tag} tags={tags} setTags={(tag) => setTags(tag)} />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default function Body({ boardID, columnType, tags, setTags }) {
    const classes = useStyles();
    const [wentWell, setWentWell] = useState([]);
    const [toImprove, setToImprove] = useState([]);
    const [actionItems, setActionItems] = useState([])

    useEffect(() => {
        // console.log(tags) // [{},{},...]
        // note: setstate in loop may overwrite previous value so 
        // https://stackoverflow.com/questions/63199884/update-array-state-on-react-using-hooks-replaces-instead-of-concat
        // ex :setWentWell(tagsCopy =>
        //             tagsCopy.concat([{ ...element }]).sort((o1, o2) => o1.order - o2.order));

        //reset lại trước khi re-render, nếu ko record cũ bị lặp lại
        // setWentWell([]);
        // setToImprove([]);
        // setActionItems([]);

        setWentWell(tags
            .filter(tag => tag.colTypeID === 1)
            .sort((o1, o2) => o1.order - o2.order)
        );
        setToImprove(tags.filter(tag => tag.colTypeID === 2).sort((o1, o2) => o1.order - o2.order));
        setActionItems(tags.filter(tag => tag.colTypeID === 3).sort((o1, o2) => o1.order - o2.order));
    }, [tags]);

    const handleOnDragEnd = async (result) => {
        if (!result.destination)
            return;

        if (result.source.index === result.destination.index && result.source.droppableId === result.destination.droppableId) {
            console.log('Không bị thay đổi');
            return;
        }
        // console.log(result);

        const oldOrder = result.source.index;
        const newOrder = result.destination.index;
        const oldType = +result.source.droppableId;
        const newType = +result.destination.droppableId;
        let tagToChange;

        // console.log(oldOrder);
        // console.log(newOrder);

        if (oldType === 2) {
            tagToChange = toImprove[oldOrder];
        } else if (oldType === 1) {
            tagToChange = wentWell[oldOrder];
        } else if (oldType === 3) {
            tagToChange = actionItems[oldOrder];
        }

        let tagsModified = []; // là tags để set state lại cho tags ở cuối

        if (oldType === newType) {

            let tagsOfColumn = tags.filter(tag => tag.colTypeID === oldType).sort((o1, o2) => o1.order - o2.order); // danh sách tag của 1 cột
            tagsOfColumn.splice(oldOrder, 1);
            tagsOfColumn.splice(newOrder, 0, tagToChange);
            tagsOfColumn = tagsOfColumn.map((tag, index) => {// gán lại order tương ứng với thứ tự trong array
                return { ...tag, order: index };
            });

            // cập nhật 'tags' , những tag nào tồn tại trong mảng trên sẽ dc cập nhật lại
            tagsModified = await tags.slice().map(tag => {

                for (let i = 0; i < tagsOfColumn.length; i++) {
                    if (tag.tagID === tagsOfColumn[i].tagID)
                        return tagsOfColumn[i];
                }
                // tagsOfColumn.forEach(item => {
                //     if (tag.tagID === item.tagID)
                //         return item;
                // })  
                // => doesn't work 
                return tag;
            });
        } else {
            const tagsOfOldColumn = tags.filter((tag) => tag.colTypeID === oldType && tag.order > oldOrder).sort((o1, o2) => o1.order - o2.order);
            const tagsOfNewColumn = tags.filter((tag) => tag.colTypeID === newType && tag.order >= newOrder).sort((o1, o2) => o1.order - o2.order);
            // console.log(tagsOfOldColumn);
            // console.log(tagsOfNewColumn);

            tagsModified = tags.slice().map(tag => {

                if (tag.tagID === tagToChange.tagID)
                    return { ...tag, order: newOrder, colTypeID: newType };

                if (tagsOfOldColumn.filter(e => e.tagID === tag.tagID).length === 1)
                    return { ...tag, order: tag.order - 1 };

                if (tagsOfNewColumn.filter(e => e.tagID === tag.tagID).length === 1)
                    return { ...tag, order: tag.order + 1 };

                return tag;
            })
        }
        setTags(tagsModified);
        // console.log(tagsModified);

        const res = await fetch(`https://us-central1-retro-api-5be5b.cloudfunctions.net/app/boards/boardcontent/dragdrop/${boardID}`, {
            method: 'POST',
            body: JSON.stringify({ tags: tagsModified.filter(e => e.colTypeID === oldType || e.colTypeID === newType) }),
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`
            }
        });
        if (res.status !== 200) {
            alert('Error')
        }
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg" component="main">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid item key={1} xs={12} sm={4} md={4}>
                            <Card className={classes.paperLikeShadow}>
                                <CardHeader
                                    title={
                                        <Badge badgeContent={wentWell.length} color="secondary">
                                            Went Well
                                    </Badge>}
                                    action={
                                        <div>
                                            <CreateTagDialog
                                                // colTypeID={columnType[0].colTypeID}// wentWell id is 1
                                                colTypeID={columnType === undefined || columnType[0] === undefined ? 0 : columnType[0].colTypeID}
                                                setTags={(tags) => setTags(tags)}
                                                boardID={boardID}
                                                tags={tags}
                                            />
                                        </div>}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <Droppable droppableId={"1"}>
                                        {(provided) => (
                                            <ul className="1" {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    wentWell.length === 0 ?
                                                        <Typography>Let's create some tags</Typography>
                                                        :
                                                        wentWell.map((element, index) => (// index là thứ tự của element trong mảng wentWell
                                                            <li key={element.tagID}>
                                                                <Tag color={'#c7e2b2'} tags={tags} tag={element} index={index} setTags={(tags) => setTags(tags)} />
                                                            </li>
                                                        ))
                                                }
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item key={2} xs={12} sm={4} md={4}>
                            <Card className={classes.paperLikeShadow}>
                                <CardHeader
                                    action={
                                        <div>
                                            <CreateTagDialog
                                                // colTypeID={columnType[0].colTypeID}// toImprove id is 2
                                                colTypeID={columnType === undefined || columnType[1] === undefined ? 0 : columnType[1].colTypeID}
                                                setTags={(tags) => setTags(tags)}
                                                boardID={boardID}
                                                tags={tags}
                                            />
                                        </div>
                                    }
                                    title={
                                        <Badge badgeContent={toImprove.length} color="secondary">
                                            To Improve
                                        </Badge>
                                    }
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <Droppable droppableId="2">
                                        {(provided) => (
                                            <ul className="2" {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    toImprove.length === 0 ?
                                                        <Typography>Let's create some tags</Typography>
                                                        :
                                                        toImprove.map((element, index) => (
                                                            <li key={element.tagID}>
                                                                <Tag color={'#fbcead'} tag={element} index={index} tags={tags} setTags={(tags) => setTags(tags)} />
                                                            </li>

                                                        ))
                                                }
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item key={3} xs={12} sm={4} md={4}>
                            <Card className={classes.paperLikeShadow}>
                                <CardHeader
                                    action={
                                        <div>
                                            <CreateTagDialog
                                                // colTypeID={columnType[0].colTypeID}// action items id is 3
                                                colTypeID={columnType === undefined || columnType[2] === undefined ? 0 : columnType[2].colTypeID}
                                                tags={tags}
                                                setTags={(tags) => setTags(tags)}
                                                boardID={boardID}
                                            />
                                        </div>
                                    }
                                    title={
                                        <Badge badgeContent={actionItems.length} color="secondary">
                                            Action Items
                                        </Badge>
                                    }
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <Droppable droppableId="3">
                                        {(provided) => (
                                            <ul className="3" {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    actionItems.length === 0 ?
                                                        <Typography>Let's create some tags</Typography>
                                                        :
                                                        actionItems.map((element, index) => (
                                                            <li key={element.tagID}>
                                                                <Tag color={'#f69b9a'} tags={tags} tag={element} index={index} setTags={(tags) => setTags(tags)} />
                                                            </li>
                                                        ))
                                                }
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DragDropContext>
            </Container>
        </React.Fragment >
    );
}