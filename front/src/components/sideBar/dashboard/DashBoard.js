import React from 'react';
import './DashBoard.css';
import '../../../App.css';
import Selector from '../selector/Selector'

const DashBoard = (props) => {
    return (
      <div className="dashboard" style={{height: props.size*28}}>
        <Selector title="DASHBOARD" updateView = {props.updateView} inFocus={props.view === "DASHBOARD"}/>
        <Selector title="All Requests" updateView = {props.updateView} inFocus={props.view === "All Requests"}/>
      </div>
    );
}

export default DashBoard;
