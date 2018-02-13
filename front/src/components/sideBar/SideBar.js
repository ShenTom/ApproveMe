import React from 'react';
import DashBoard from './dashboard/DashBoard';
import Channels from './channels/Channels'
import './SideBar.css';

const SideBar = (props) => {
    return (
      <div className="sideBar">
        <div className="header">
          <span className="org-name">CACTES</span>
        </div>
        <DashBoard size={2} updateView = {props.updateView} view={props.view}/>
        <Channels size={2} updateView = {props.updateView} channels = {props.channels} view={props.view} groups={props.groups}/>
      </div>
    );
}

export default SideBar;
