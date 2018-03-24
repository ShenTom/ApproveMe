import React, {Component} from 'react';
import './RequestDetailView.css';
import FooterInput from './footerInput/FooterInput';
import {url} from "../../../../api/api"
import {connect} from 'react-redux';

class RequestDetailView extends Component{
  constructor(props){
    super(props)
    console.log(this.props.request)
    this.state = {
      comments: [],
      status: this.props.request.tagged[this.props.loadedData.user_id]
    }
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this)
    this.approveRequests = this.approveRequests.bind(this)
    this.declineRequests = this.declineRequests.bind(this)
  }

  handleCommentSubmit(event){
    console.log(event.target.value)
    this.setState({
      comments: this.state.comments.concat([event.target.value])
    })
  }

  renderComment(comment){
    console.log(comment)
    return(
      <div className="comment">
        {comment}
      </div>
    )
  }

  componentWillReceiveProps(props){

    this.setState({
      status: props.request.tagged[this.props.loadedData.user_id]
    })
  }

  async approveRequests(){
    const res = await fetch(url+"/approve?event="+this.props.request.event+"&user_id=" + this.props.loadedData.user_id, {
                        method: 'POST'
                      })
    const resJson = await res.json();
    if(resJson.successful){
      this.setState({
        status: 2
      })
      this.props.request.tagged[this.props.loadedData.user_id] = 2
    }
    return resJson
  }

  async declineRequests(){
    const res = await fetch(url+"/decline?event="+this.props.request.event+"&user_id=" + this.props.loadedData.user_id, {
                        method: 'POST'
                      })
    const resJson = await res.json();
    if(resJson.successful){
      this.setState({
        status: 0
      })
      this.props.request.tagged[this.props.loadedData.user_id] = 0
    }
    return resJson
  }

  render(){
    var d = new Date(0)
    d.setUTCSeconds(this.props.request.timestamp);
    this.time = d.toISOString()
    let approvedStyle;
    let declinedStyle;
    if (this.state.status == 2){
      approvedStyle = {color: "rgb(63, 179, 79)"}
    } else if (this.state.status == 0) {
      declinedStyle = {color: "rgb(63, 179, 79)"}
    }
    console.log(this.props.request.tagged)
    return(
      <div className="request-info-container">
        <div className="request-content">
          <div className="scrollable">
            <div className="header">
              <div className="left">
                <i className="incomplete material-icons complete-icon" style={approvedStyle}onClick={this.approveRequests}>check_circle</i>
                <i className="incomplete material-icons complete-icon" style={declinedStyle}onClick={this.declineRequests}>highlight_off</i>
                <div className="editable">{this.props.request.event}</div>

              </div>
            </div>
            <div className="options-bar"></div>
            <div className="main-field">
              <div className="input-container time-selector">
                <i className="material-icons" title="Due date [U]">event</i>
                <div className="date">{this.props.request.date}</div>
              </div>
              <div className="input-container">
                {Object.keys(this.props.request.tagged).map((tagged)=>{
                  return(tagged)
                })}
              </div>
              <div className="input-container">
              </div>
            </div>
            <div className="comments-section">
              {this.state.comments.map((comment)=>{
                return(
                  this.renderComment(comment)
                )
              })}
            </div>
            <div className="additional-info">
              created {this.time} by {this.props.request.requester}
            </div>
          </div>
          <div className="request-info-footer">
            <FooterInput handleCommentSubmit={this.handleCommentSubmit}/>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loadedData: state.data,
  };
}

export default connect(mapStateToProps)(RequestDetailView);
