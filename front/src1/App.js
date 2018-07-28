import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/loginPage/LoginPage";
import LoggedInView from "./components/LoggedInView";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      main_view: "DASHBOARD"
    };
    this.update_main_view = this.update_main_view.bind(this);
  }

  update_main_view(new_view) {
    this.setState({
      main_view: new_view
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/" component={LoggedInView} />
      </Switch>
    );
  }
}
export default App;
