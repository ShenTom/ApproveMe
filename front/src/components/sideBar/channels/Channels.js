import React, {Component} from 'react';
import "./Channels.css"
import Selector from "../selector/Selector";


class Channels extends Component{
  constructor(props){
    super(props)
    this.state = {
      channels: this.props.channels
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      channels: props.channels
    })
  }

  render(){
    return (
      <div className="channel">
        <Selector title="CHANNELS" updateView = {this.props.updateView} inFocus={this.props.view === "CHANNELS"}/>
        {this.state.channels.concat(this.props.groups).map((channel) => {
          const inFocus = this.props.view === channel.name;
        
          return (
            <Selector
              key = {channel.name}
              title={channel.name}
              private={channel.is_group}
              updateView = {this.props.updateView}
              inFocus ={inFocus}/>
          )
        })}

      </div>
    );
  }
}

export default Channels;
