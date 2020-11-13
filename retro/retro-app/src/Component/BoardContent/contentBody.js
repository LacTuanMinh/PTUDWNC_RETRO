import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { IconButton, Badge, Grid } from '@material-ui/core';
import CreateTagDialog from '../Dialog/CreateTagDialog';
import ChangeTagDialog from '../Dialog/ChangeTagDialog';
import RemoveTagDialog from '../Dialog/RemoveTagDialog';

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
function Tag({ tags, tag, setTags, color }) { // tags: toàn bộ tag cũa board
    const classes = useStyles();
    return (
        <div className={classes.tagContent} style={{ backgroundColor: color, display: 'inline-block', width: '95%' }}>

            <div style={{ float: 'left', width: '90%', fontSize: '18px', paddingTop: '5px', paddingBottom: '5px' }}>
                {tag.tagContent}
            </div>

            <div style={{ float: 'right', width: '10%' }}>
                <ChangeTagDialog tags={tags} tag={tag} setTags={(tag) => setTags(tag)} />
                <RemoveTagDialog tags={tags} tag={tag} setTags={(tag) => setTags(tag)} />
            </div>

        </div>
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

        //reset lại trước khi re-render, nếu ko record cũ bị lặp lại
        setWentWell([]);
        setToImprove([]);
        setActionItems([]);

        tags.forEach(element => {
            // console.log(element)
            if (element.colTypeID === 1) {
                const tagsCopy = wentWell.slice();
                setWentWell(tagsCopy => tagsCopy.concat([{ ...element }]));
            }
            else if (element.colTypeID === 2) {
                const tagsCopy = toImprove.slice();
                setToImprove(tagsCopy => tagsCopy.concat([{ ...element }]));
            }
            else if (element.colTypeID === 3) {
                const tagsCopy = actionItems.slice();
                setActionItems(tagsCopy => tagsCopy.concat([{ ...element }]));
            }
        });
    }, [tags]);

    // console.log(tags);
    return (
        <React.Fragment>
            <Container maxWidth="lg" component="main">
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
                                {
                                    wentWell.length === 0 ?
                                        <Typography>Let's create some tags</Typography>
                                        :
                                        wentWell.map((element) => (
                                            <Tag color={'#9bb899'} tags={tags} tag={element} setTags={(tags) => setTags(tags)} key={element.tagID} />
                                        ))
                                }
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
                                    </div>}
                                title={
                                    <Badge badgeContent={toImprove.length} color="secondary">
                                        To Improve
                                    </Badge>}
                                className={classes.cardHeader}
                            />
                            <CardContent>
                                {
                                    toImprove.length === 0 ?
                                        <Typography>Let's create some tags</Typography>
                                        :
                                        toImprove.map((element) => (
                                            <Tag color={'#fbcead'} tag={element} tags={tags} setTags={(tags) => setTags(tags)} key={element.tagID} />
                                        ))
                                }
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
                                    </div>}
                                title={
                                    <Badge badgeContent={actionItems.length} color="secondary">
                                        Action Items
                                    </Badge>}
                                className={classes.cardHeader}
                            />
                            <CardContent>
                                {
                                    actionItems.length === 0 ?
                                        <Typography>Let's create some tags</Typography>
                                        :
                                        actionItems.map((element) => (
                                            <Tag color={'#f69b9a'} tags={tags} tag={element} setTags={(tags) => setTags(tags)} key={element.tagID} />
                                        ))
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment >
    );
}