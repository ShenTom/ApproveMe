import React, {Component} from 'react';
import './RequestDetailView.css';

class RequestDetailView extends Component{
  constructor(props){
    super(props)
    console.log(this.props.request)
    this.time = this.props.request.timestamp
    console.log(this.time)
    var d = new Date(0)
    d.setUTCSeconds(this.time);
    const x = d.toISOString()
    console.log(x)
    this.time = x
  }

  render(){
    return(
      <div className="request-info-container">
        <div className="request-content">
          <div className="header">
            <i className="incomplete material-icons complete-icon">check_circle</i>
            <div className="editable">{this.props.request.event}</div>
            <div>{this.time}</div>
          </div>
          <div className="options-bar"></div>
          <div className="main-field">
            <div className="input-container time-selector">
              <i class="material-icons" title="Due date [U]">event</i>
            </div>
            <div className="input-container">
            </div>
            <div className="input-container">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RequestDetailView;
