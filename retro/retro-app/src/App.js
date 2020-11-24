import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './index.css';
import DashBoard from './Component/DashBoard/index';
import Register from './Component/Register/index';
import SignIn from './Component/SignIn/index';
import Profile from './Component/Profile/index';
import BoardContent from './Component/BoardContent';
import TimeCounter from './Component/Realtime/index';



export default function App() {
    return (
        // <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/dashboard" />
                </Route>
                <Route path="/register" exact component={Register} />
                <Route path="/signin" exact component={SignIn} />
                <Route path="/dashboard" exact component={DashBoard} />
                <Route path="/profile" exact component={Profile} />
                <Route path="/dashboard/boardcontent/:boardid" exact component={BoardContent} />
                {/* <Route path="/timemachine" exact component={TimeCounter} /> */}
            </Switch>
        </Router>
        // </React.StrictMode >
    );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
