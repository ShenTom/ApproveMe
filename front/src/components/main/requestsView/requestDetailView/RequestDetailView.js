import React, {Component} from 'react';
import './RequestDetailView.css';
import FooterInput from './footerInput/FooterInput';

class RequestDetailView extends Component{
  constructor(props){
    super(props)
    console.log(this.props.request)
    this.state = {
      comments: []
    }
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this)
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

  render(){
    var d = new Date(0)
    d.setUTCSeconds(this.props.request.timestamp);
    this.time = d.toISOString()
    return(
      <div className="request-info-container">
        <div className="request-content">
          <div className="scrollable">
            <div className="header">
              <div className="left">
                <i className="incomplete material-icons complete-icon">check_circle</i>
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

export default RequestDetailView;
