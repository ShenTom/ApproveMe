import React, {Component} from 'react';
import './ChannelView.css';

class ChannelView extends Component{
  constructor(props){
    super(props)
    this.state = {
      channels: this.props.channels,
      groups: this.props.groups,
      searchText: "",
      availableChannels: this.props.channels,
      availableGroups: this.props.groups
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.renderPrivateChannelSection = this.renderPrivateChannelSection.bind(this)
    this.renderPublicChannelSection = this.renderPublicChannelSection.bind(this)
  }

  componentWillReceiveProps(props){
    this.setState({
      channels: props.channels,
      groups: props.groups,
      availableChannels: props.channels,
      availableGroups: props.groups
    })
  }



  renderPrivateChannelSection(){
    if (this.state.availableGroups.length > 0) {
      return(
        <div className="subsection">
          <div className="divider">
            <div className="hr">
            </div>
            <span className="hr-name">Private Channels</span>

          </div>
          {this.state.availableGroups.map((group) => {
            return(
              <div key={group.name} className="channel" onClick={()=>{this.props.updateView(group.name)}}>
                <div className="left">
                  <span className="name">
                    <i class="material-icons channel-icon private">lock</i>
                    {group.name}
                  </span>
                </div>
              </div>
            )

          })}
        </div>
      )
    }
  }

  renderPublicChannelSection(){
    if (this.state.availableChannels.length > 0) {
      return(
        <div className="subsection">
          <div className="divider">
            <div className="hr">
            </div>
            <span className="hr-name">Public Channels</span>
          </div>
          {this.state.availableChannels.map((channel) => {
            return(
              <div key={channel.name} className="channel" onClick={()=>{this.props.updateView(channel.name)}}>
                <div className="left">
                  <span className="name">
                    <span className="hash">#</span>
                    {channel.name}
                  </span>
                </div>
              </div>
            )

          })}
        </div>
      )
    }

  }

  handleSearch(event){
    let value = event.target.value
    // search for Channels
    let newAvailableChannels = []
    for (var channel in this.state.channels){
      let index = this.state.channels[channel].name.indexOf(value)
      if (index !== -1){
        newAvailableChannels.push([this.state.channels[channel],index])
      }
    }
    var sorted = newAvailableChannels.sort(function(a,b) {
      return a[1] - b[1];
    });
    for (var c in sorted){
      sorted[c] = sorted[c][0]
    }
    // search for groups
    let newAvailableGroups = []
    for (var group in this.state.groups){
      let index = this.state.groups[group].name.indexOf(value)
      if (index !== -1){
        newAvailableGroups.push([this.state.groups[group],index])
      }
    }
    var sortedGroups = newAvailableGroups.sort(function(a,b) {
      return a[1] - b[1];
    });
    for (var g in sortedGroups){
      sortedGroups[g] = sortedGroups[g][0]
    }
    this.setState({
      searchText: value,
      availableChannels: sorted,
      availableGroups: sortedGroups
    })
  }

  render(){
    return(
      <div className="channel-container">
        <div className="header">
          <p>Browse Channels</p>
        </div>
        <div className="search">
          <input placeholder="Search Channels"
                 onChange = {this.handleSearch}>
          </input>
        </div>
        <div className="content">

            {this.renderPublicChannelSection()}
            {this.renderPrivateChannelSection()}


        </div>
      </div>
    )
  }

}

export default ChannelView;
