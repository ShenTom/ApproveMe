import React, {Component} from 'react';
import './Main.css';
import RequestsView from './requestsView/RequestsView';
import ChannelView from './channelView/ChannelView';
import {connect} from 'react-redux';

class Main extends Component {
  constructor(props){
    super(props)
  }
  render(){
    switch(this.props.view) {
      case "CHANNELS":
        return(
          <div className="main">
            <ChannelView channels={this.props.loadedData.channels} groups={this.props.loadedData.groups} updateView={this.props.updateView}/>
          </div>
        )
      case "DASHBOARD":
        return(
          <div className="main">

          </div>
        )
      default:
        return(
          <div className="main">
            <RequestsView name={this.props.view} requests={this.props.loadedData.requests}/>
          </div>
        )
    }
  }
}

function mapStateToProps(state) {
  return {
    loadedData: state.data,
  };
}

export default connect(mapStateToProps)(Main);
