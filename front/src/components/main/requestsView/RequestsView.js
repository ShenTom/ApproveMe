import React, { Component } from 'react';
import "./RequestsView.css"
import EmptyStateView from './EmptyStateView'
import RequestBar from './requestBar/RequestBar'
import RequestDetailView from './requestDetailView/RequestDetailView'

class RequestsView extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: "",
      requests: this.props.requests,
      relatedRequests: this.props.requests,
      requestFocused: false,
      inFocusName: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRequestDetails = this.handleRequestDetails.bind(this);
    this.handleBackgroundPress = this.handleBackgroundPress.bind(this);
  }

  componentWillReceiveProps(prop){
    this.setState({
      requests: prop.requests,
      relatedRequests: this.props.requests
    })

  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(event) {
   this.setState({value: event.target.value});
  }

  handleRequestDetails(request, event){
    this.setState({
      requestFocused: true,
      inFocusRequest: request
    })

  }

  handleBackgroundPress(e){
    this.setState({
      requestFocused: false,
      inFocusName: ""
    })
  }

  render() {
    let content;
    content = <EmptyStateView />
    content = <div className="request-container">
                <div className="task-group">
                  <div className="group-header">
                    <span className="">Requests without a channel</span>
                  </div>
                </div>
              </div>
    content = <div className="request-container">
                <div className="task-list">
                  {
                    this.state.requests.map((request)=>{
                      return (<RequestBar handlePress={this.handleRequestDetails} request={request} inFocus={this.state.requestFocused && this.state.inFocusRequest.event === request.event}/>)
                    })
                  }

                </div>
              </div>
    let requestInfoView;
    if (this.state.requestFocused){
      requestInfoView = <RequestDetailView request={this.state.inFocusRequest}/>
    }
    return (
      <div className="requestsView">
        <div className="container" onClick={this.handleBackgroundPress}>
          <div className="mainHeader">
            <div className="left-container">
              <span className="name">{this.props.name}</span>
            </div>
          </div>
          <div className="main-container">
            <div className="list-view">
              <form className="create-request" onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  placeholder="Add a task..."
                  title="Add a task [ENTER]"
                  onChange={this.handleChange}
                  value={this.state.value}>
                </input>
                <div className="create-request-button">
                  <i className="material-icons">add</i>
                </div>
              </form>
              {content}
            </div>
          </div>
        </div>
        {requestInfoView}
      </div>
    );
  }
}

export default RequestsView;

// <div class="settings-container ">
//   <div class="menu-button">
//     <i class="material-icons">settings</i>
//   </div>
// </div>
// <div class="search-container">
//   <i class="material-icons search-icon">search</i>
//   <form>
//     <input type="text" class="search-input"/>
//   </form>
// </div>
// <div class="sort-container no-print">
//   <i class="sort material-icons">sort</i>
//   <span class="text">Group by Channel</span>
//   <i class="sort material-icons">arrow_drop_down</i>
// </div>
