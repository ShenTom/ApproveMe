import React, { Component } from 'react';
import "./EmptyStateView.css";
import logo from './cactes-logo.png';
class EmptyStateView extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: ""
    }
  }

  render() {
    return (
      <div className="emptystate-container">
        <img src={logo} alt=""></img>
        <div className="header">Get Started!</div>
        <div className="bottom-text">
          Add your first task to this project by clicking "Add a task..." just above
        </div>
      </div>
    );
  }
}

export default EmptyStateView;
