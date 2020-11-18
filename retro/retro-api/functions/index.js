const functions = require('firebase-functions');
const firebase = require('firebase');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const FacebookStrategy = require('passport-facebook').Strategy;
const utils = require('./utils/utils');
const app = express();


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

// initialize passport with express
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport.serializeUser(function (user, cb) {
//     cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//     cb(null, obj);
// });

app.use(cors({ origin: '*' }));

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = utils.secretKey;

// create jwt strategy
let JWT_strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('You access jwtstrategy. userID : ' + jwt_payload.id);
    const user = firebase.database().ref().child('users').orderByChild('userID').equalTo(jwt_payload.id);
    user.once('value', snapshot => {
        // console.log(snapshot.val());
        if (snapshot.val() !== null)
            return next(null, snapshot.val());
        else return next(null, false);
    });
});
// use the JWT strategy
passport.use(JWT_strategy);

// create and use the facebook strategy
// passport.use(new FacebookStrategy({
//     clientID: utils.facebook_key,
//     clientSecret: utils.facebook_secret,
//     callbackURL: utils.callback_url,
//     profileFields: ['id', 'displayName']
// }, function (accessToken, refreshToken, profile, done) {
//     console.log("facebook strategy " + accessToken);
//     console.log('profile :'); console.log(profile);

//     // User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
//     //     if (err)
//     //         return done(err);
//     //     // if the user is found, then log them in
//     //     if (user) {
//     //         return done(null, user); 
//     //     } else {
//     //         // if there is no user found with that facebook id, create them
//     //         var newUser            = new User();
//     //         // set all of the facebook information in our user model
//     //         newUser.facebook.id    = profile.id; // set the users facebook id                   
//     //         newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
//     //         newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//     //         newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
//     //         // save our user to the database
//     //         newUser.save(function(err) {
//     //             if (err)
//     //                 throw err;
//     //             // if successful, return the new user
//     //             return done(null, newUser);
//     //         });
//     //     }

//     // });
//     return done(null, profile);
// }
// ));



app.get('/', (req, res) => {
    res.send('home');
})

// middleware check firebase has been init-ed
app.use((req, res, next) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(utils.apiConfig);
    }
    next();
})

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
// );

// app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/account',
//         // failureRedirect: '/signIn'
//     }));

// app.get('/account', isLoggedIn, (req, res) => {
//     console.log(req.user);
//     res.status(200).send(req.user);
// });


// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         console.log("you are facebook-authenticated");
//         return next();
//     }
//     res.redirect('/authenticate')
// }


app.post('/signIn', (req, res) => {

    const user = firebase.database().ref().child('users').orderByChild('userName').equalTo(req.body.userName);
    user.once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                // console.log(child.val())                    
                // console.log(child.val().userID)
                if (bcrypt.compareSync(req.body.password, child.val().password)) {
                    const token = jwt.sign({ id: child.val().userID }, jwtOptions.secretOrKey);
                    return res.status(200).send({ mesg: "Signed in", token: token, id: child.val().userID, name: child.val().userName });
                } else {
                    return res.status(401).send({ mesg: "Wrong password! Check again" });
                }
            });
        } else {
            // console.log("không tồn tại");
            return res.status(401).json({ mesg: 'No such user found' });
        }
    });
});

app.post('/register', (req, res) => {
    // console.log(req.body.userName);
    // console.log(req.body.password);
    const userName = req.body.userName;
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword
    if (utils.isBlankString(userName) || utils.isBlankString(password) || utils.isBlankString(verifyPassword)) {
        return res.status(400).send({ mesg: 'Some fields are blank string' });
    }
    if (password !== verifyPassword)
        return res.status(400).send({ mesg: 'Two passwords does not match' });
    if (password.length <= 3)
        return res.status(400).send({ mesg: 'Password must be longer than 3 characters' });

    const N = utils.hashRound; //10\
    const hashedPassword = bcrypt.hashSync(password, N);
    const userRef = firebase.database().ref().child('users');
    const userPusher = userRef.push();
    const newUser = {
        userName,
        password: hashedPassword,
    };

    // thêm user mới mà chưa có id
    userPusher.set(newUser).catch((err) => {
        console.log(err);
        return res.status(500).send({ mesg: 'Fail to register! Try again' })
    });

    // lấy key phát sinh set làm id của user
    userRef.child(userPusher.key).update({ userID: userPusher.key })
        .then(() => {
            newUser.userID = userPusher.key;
            const token = jwt.sign({ id: newUser.userID }, jwtOptions.secretOrKey);
            return res.status(200).send({ mesg: "Welcom to join my app", token: token, id: newUser.userID, name: newUser.userName });
        }).catch((err) => {
            console.log(err);
            return res.status(500).send({ mesg: 'Fail to register! Try again' })
        });
    return 1;
})

app.get('/boards/boardcontent/:boardID', async (req, res) => {
    const boardID = req.params.boardID;

    // lấy thông tin board    
    const boardSnapshot = await firebase.database().ref().child(`boards/${boardID}`).once('value');
    const board = (await boardSnapshot).val();
    // console.log(board)
    if (board === null)
        return res.status(500).send({ mesg: "The board does not exist!" })

    // lấy thông tin tags
    const tagSnapshot = await firebase.database().ref().child('tags').orderByChild('boardID').equalTo(boardID).once('value');
    const tags = (await tagSnapshot).val();

    //lấy thông tin colType
    const colTypeSnapshot = await firebase.database().ref().child('columnType').once('value');
    const colType = (await colTypeSnapshot).val();


    console.log(board) // {...}
    console.log(tags) // {{...},{...},...}
    console.log(colType) // [{...},{...},...]
    return res.status(200).send({ board, tags: tags === null ? [] : Object.values(tags), columnType: colType });
})

app.post('/boards/boardcontent/changename/:boardID', (req, res) => {

    const newBoardName = req.body.newBoardName;
    const boardID = req.params.boardID;
    const boardRef = firebase.database().ref().child('boards').orderByChild('boardID').equalTo(boardID);
    boardRef.once('value', snapshot => {

        console.log(snapshot.val())
        if (snapshot.val() === null)
            return res.status(500).send({ mesg: 'Modify failed' });
        snapshot.forEach(underSnap => {
            underSnap.ref.update({ boardName: newBoardName }).t
        })
        return res.status(200).send({ mesg: 'Modify successfully', newBoardName: newBoardName });
    });
    return 1;
})

app.post('/boards/boardcontent/changedescription/:boardID', (req, res) => {

    const newDescription = req.body.newDesc;
    const boardID = req.params.boardID;
    const boardRef = firebase.database().ref().child('boards').orderByChild('boardID').equalTo(boardID);
    boardRef.once('value', snapshot => {

        console.log(snapshot.val());
        if (snapshot.val() === null)
            return res.status(500).send({ mesg: 'Modify failed' });
        snapshot.forEach(underSnap => {
            underSnap.ref.update({ description: newDescription });
        });
        return res.status(200).send({ mesg: 'Modify successfully', newDescription: newDescription });
    });
    return 1;
})

app.post('/boards/boardcontent/addtag/:boardID', (req, res) => {
    // console.log(req.params.boardID);
    // console.log(req.body);

    if (utils.isBlankString(req.body.tagContent)) {
        return res.status(400).send({ mesg: 'Tag content cannot be empty' });
    }

    const boardID = req.params.boardID;
    const tagContent = req.body.tagContent;
    const colTypeID = req.body.colTypeID;

    const tagRef = firebase.database().ref().child('tags').orderByChild('boardID').equalTo(boardID);
    tagRef.once('value', snapshot => {
        // console.log(snapshot.val());

        let order = 0;

        if (snapshot.val() !== null) {
            const arrayTags = Object.values(snapshot.val());
            const tagsOfCol = arrayTags.filter(tag => tag.colTypeID === colTypeID).sort((o1, o2) => o1.order - o2.order);
            if (tagsOfCol.length !== 0)
                order = (tagsOfCol[tagsOfCol.length - 1]).order + 1;
        }
        // console.log(order);
        const newTagRef = firebase.database().ref().child('tags');
        const tagPusher = newTagRef.push();
        const newTag = {
            boardID,
            tagContent,
            colTypeID,
            order
        };
        // thêm tag mới mà chưa có id
        tagPusher.set(newTag).catch((err) => {
            console.log(err);
            return res.status(500).send({ mesg: 'Fail to add tag! Try again' })
        });

        // lấy key phát sinh set làm id của tag
        newTagRef.child(tagPusher.key).update({ tagID: tagPusher.key }).then(() => {
            newTag.tagID = tagPusher.key;
            return res.status(200).send({ mesg: "Add tag successfully", newTag });
        }).catch((err) => {
            console.log(err);
            return res.status(500).send({ mesg: 'Fail to add tag! Try again' })
        });
    });
    return 1;
})

app.post('/boards/boardcontent/edittag/:boardID', (req, res) => {

    const tagID = req.body.tagID;
    const tagContent = req.body.tagContent;
    const boardID = req.params.boardID;
    // console.log(boardID);

    const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagID);
    tagRef.once('value', snapshot => {

        // console.log(snapshot.val());
        if (snapshot.val() === null)
            return res.status(500).send({ mesg: 'Modify failed' });

        snapshot.forEach(underSnap => { // only one child but need loop
            if (underSnap.val().boardID !== boardID)
                return res.status(500).send({ mesg: 'Modify failed' });
            underSnap.ref.update({ tagContent });
            return 1;
        });
        return res.status(200).send({ mesg: 'Modify successfully', tagContent });
    })
    return 1;
})

app.post('/boards/boardcontent/dragdrop/:boardID', async (req, res) => {

    const tags = req.body.tags;
    // console.log(tags);//[{}, {}, ...]

    tags.forEach(tag => {
        const tagRef = firebase.database().ref().child(`tags/${tag.tagID}`);
        tagRef.once('value', snapshot => {
            // console.log(snapshot.val()); // {...}
            snapshot.ref.update(tag)
        });
    })
    return res.status(200).send({ mesg: 'Modify successfully' });

    // const { tagID, oldType, newType, oldOrder, newOrder } = req.body;
    // const boardID = req.params.boardID;

    // const tagsSnapshot = await firebase.database().ref().child('tags').orderByChild('boardID').equalTo(boardID).once('value');
    // if (tagsSnapshot.val() === null || tagsSnapshot.val() === undefined)
    //     res.status(400).send("No tag exists");

    // if (oldType === newType) {

    // } else if (oldType !== newType) {

    //     const tags = await Object.values(tagsSnapshot.val());
    //     const tagsOfOldColumn = tags.filter((tag) => tag.colTypeID === oldType).sort((o1, o2) => o1.order - o2.order);
    //     const tagsOfNewColumn = tags.filter((tag) => tag.colTypeID === newType).sort((o1, o2) => o1.order - o2.order);
    //     const tagToDragDrop = tagsOfOldColumn.splice(oldOrder, 1)[0]; // remove target out of 'tagsOfOldColumn'

    //     // console.log(tagsOfOldColumn);// [{},{},...] or []
    //     // console.log(tagsOfNewColumn);// [{},{},...] or []
    //     // console.log(tagToDragDrop);

    //     //update order of tags of old column
    //     for (let i = oldOrder; i < tagsOfOldColumn.length; i++) {
    //         const newOrder = tagsOfOldColumn[i].order - 1;
    //         tagsOfOldColumn[i].order = newOrder;
    //         const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagsOfOldColumn[i].tagID);
    //         tagRef.once('value').then(snapshot => {

    //             if (snapshot.val() === null)
    //                 return res.status(500).send({ mesg: 'Error' });

    //             snapshot.forEach(underSnap => { // only one child but need loop
    //                 underSnap.ref.update({ order: newOrder });
    //             });
    //         })
    //     }

    //     //update order of tags of new column
    //     for (let i = newOrder; i < tagsOfNewColumn.length; i++) {
    //         const newOrder = tagsOfNewColumn[i].order + 1;
    //         tagsOfNewColumn[i].order = newOrder;
    //         const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagsOfNewColumn[i].tagID);
    //         tagRef.once('value').then(snapshot => {

    //             if (snapshot.val() === null)
    //                 return res.status(500).send({ mesg: 'Error' });

    //             snapshot.forEach(underSnap => { // only one child but need loop 
    //                 underSnap.ref.update({ order: newOrder });
    //             });
    //         })
    //     }

    //     // update the drag-droped tag
    //     const tagToDragDropCopy = { ...tagToDragDrop, order: newOrder, colTypeID: newType }
    //     const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagID);
    //     tagRef.once('value').then(async snapshot => {
    //         if (snapshot.val() === null)
    //             return res.status(500).send({ mesg: 'Error' });

    //         snapshot.forEach(underSnap => { // only one child but need loop 
    //             underSnap.ref.update({ ...tagToDragDropCopy });
    //         });

    //         //get all tags
    //         const allTagsSnapshot = await firebase.database().ref().child('tags').orderByChild('boardID').equalTo(boardID).once('value');
    //         const allTagsArray = (await allTagsSnapshot.val());
    //         return res.status(200).send({ tags: Object.values(allTagsArray) });
    //     });

    // }

    // const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagID);
    // tagRef.once('value', snapshot => {

    //     // console.log(snapshot.val());
    //     if (snapshot.val() === null)
    //         return res.status(500).send({ mesg: 'Modify failed' });


    //     snapshot.forEach(underSnap => { // only one child but need loop
    //         if (underSnap.val().boardID !== boardID)
    //             return res.status(500).send({ mesg: 'Modify failed' });
    //         underSnap.ref.update({ tagContent });
    //         return 1;
    //     });
    //     return res.status(200).send({ mesg: 'Modify successfully', tagContent });
    // })
    // return 1;
})

app.post('/boards/boardcontent/removetag/:boardID', (req, res) => {
    const boardID = req.params.boardID;
    const tagID = req.body.tagID;
    // console.log(boardID);

    const tagRef = firebase.database().ref().child('tags').orderByChild('tagID').equalTo(tagID);
    tagRef.once('value', snapshot => {

        // console.log(snapshot.val());
        if (snapshot.val() === null)
            return res.status(500).send({ mesg: 'Remove failed' });

        snapshot.forEach(underSnap => {
            if (underSnap.val().boardID !== boardID)
                return res.status(500).send({ mesg: 'Remove failed' });

            underSnap.ref.remove().then(() => {
                return res.status(200).send({ mesg: 'Remove successfully', tagID });
            }).catch((err) => {
                console.log(err);
                return res.status(500).send({ mesg: 'Remove failed' });
            });
            return 1;
        })
        return 1;
    });
    return 1;
})

// this middleware protect all routes below it
app.use(passport.authenticate("jwt", { session: false }));

// app.post này để dùng cho page nào cần authen trc khi hiển thị
app.post('/authenticate', (req, res) => {
    return res.status(200).end();
})

app.post('/profile/username/:userID', (req, res) => {
    // console.log(req.body.newUserName)
    // console.log(req.params.userID)
    const user = firebase.database().ref().child('users').orderByChild('userID').equalTo(req.params.userID);
    user.once('value', snapshot => {
        if (snapshot.val() === null) {
            console.log("null user");
            return res.status(400).send({ mesg: "No such user!" })
        }
        // console.log(snapshot.val()); data structure: { key: {id,name,pass}}
        snapshot.forEach(underSnap => {// chỉ 1 phần tử nhhưng cần loop để update
            underSnap.ref.update({ userName: req.body.newUserName })
        })
        return res.status(200).send({ userName: req.body.newUserName, mesg: "Modify successfully" })
    })
    return 1;
})

app.post('/profile/password/:userID', (req, res) => {
    // console.log(req.body.newPassword)
    // console.log(req.body.confirmPassword)
    // console.log(req.body.currentPassword)
    // console.log(req.params.userID)

    if (req.body.newPassword !== req.body.confirmPassword)
        return res.status(400).send({ mesg: 'Confirm password does not match' })

    const user = firebase.database().ref().child('users').orderByChild('userID').equalTo(req.params.userID);
    user.once('value', snapshot => {
        if (snapshot.val() === null) {
            console.log("null user");
            return res.status(400).send({ mesg: "No such user!" })
        }
        // console.log(snapshot.val()); data structure: { key: {id,name,pass}}
        let mesg = null;
        snapshot.forEach(underSnap => {// chỉ 1 phần tử nhhưng cần loop để update
            if (bcrypt.compareSync(req.body.currentPassword, underSnap.val().password)) {// check cũ có đúng ko
                underSnap.ref.update({ password: bcrypt.hashSync(req.body.newPassword, utils.hashRound) }) // đúng thì mới cập nhật thành cái mới
            } else {
                mesg = 'Current password is incorect';
            }
        })
        if (mesg)
            return res.status(400).send({ mesg: mesg });
        else
            return res.status(200).send({ mesg: "Modify successfully" });
    })
    return 1;
})

app.get('/boards/:userID', (req, res) => {

    console.log('you\'r authenticated');

    const boards = firebase.database().ref().child('boards').orderByChild('userID').equalTo(req.params.userID);
    boards.once('value', snapshot => {
        if (snapshot.val() === null)// snapshot.val() trả ra json
            return res.send([]);
        const newArrayDataOfOjbect = Object.values(snapshot.val());
        return res.status(200).send(newArrayDataOfOjbect)
    });
    return 1;
});

app.post('/createboard/:userID', (req, res) => {
    console.log(req.body.boardName)
    console.log(req.body.description)
    console.log(req.params.userID)

    if (utils.isBlankString(req.body.boardName)) {
        return res.status(400).send({ mesg: 'Board name cannot be empty' });
    }

    const boardRef = firebase.database().ref().child('boards');
    const boardPusher = boardRef.push();
    const newBoard = {
        boardName: req.body.boardName,
        description: req.body.description,
        userID: req.params.userID
    };
    // thêm bảng mới mà chưa có id
    boardPusher.set(newBoard).catch((err) => {
        console.log(err);
        return res.status(500).send({ mesg: 'Fail to add board! Try again' })
    });

    // lấy key phát sinh set làm id của board
    boardRef.child(boardPusher.key).update({ boardID: boardPusher.key }).then(() => {
        newBoard.boardID = boardPusher.key;
        return res.status(200).send({ mesg: "Add board successfully", newBoard });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({ mesg: 'Fail to add board! Try again' })
    });
    return 1;
})

app.post('/removeboard/:boardID', (req, res) => {

    const boardID = req.params.boardID;
    const tagRef = firebase.database().ref().child('tags').orderByChild('boardID').equalTo(boardID);
    tagRef.once('value', snapshot => {
        console.log(snapshot.val())
        snapshot.forEach(underSnap => {
            underSnap.ref.remove().then(() => {
                return null;
            }).catch((err) => {
                console.log(err)
            });
        })
    })

    const boardRef = firebase.database().ref().child(`boards/${boardID}`);
    boardRef.once('value', snapshot => {
        console.log(snapshot.val())
        snapshot.ref.remove().catch((err) => console.log(err));
    });
    return res.status(200).send({ mesg: 'Removed', boardID: boardID })
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(utils.port, () => {
    console.log(`http://localhost:8000`);
})

// module.exports = app; // incorrect
exports.app = functions.https.onRequest(app); //correct
