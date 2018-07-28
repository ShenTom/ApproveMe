import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Switch, Route, Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <p>Login Page</p>
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <p>Home Page</p>
      <Link to="/login">Login Page</Link>
    </div>
  );
};

const App = () => {
  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/" component={Home} />
    </Switch>
  );

  // return (
  //   <div>
  //     <p>React here!</p>
  //   </div>
  // );
};

export default App;
