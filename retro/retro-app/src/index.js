import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
// ReactDOM.render(
//   // <React.StrictMode>
//   <Router>
//     <Switch>
//       <Route path="/" exact>
//         <Redirect to="/dashboard" />
//       </Route>
//       <Route path="/register" exact component={Register} />
//       <Route path="/signin" exact component={SignIn} />
//       <Route path="/dashboard" exact component={DashBoard} />
//       <Route path="/profile" exact component={Profile} />
//       <Route path="/dashboard/boardcontent/:boardid" exact component={BoardContent} />
//     </Switch>
//   </Router>
//   // </React.StrictMode >
//   ,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
