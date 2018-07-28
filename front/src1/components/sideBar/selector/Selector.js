import React from 'react';
import './Selector.css';
import '../../../App.css';

const Selector = (props) => {
  let className = "selected"
  if (!props.inFocus){
    className = "selector"
  }

  let icon;
  if(props.title !== "CHANNELS" &&
      props.title !== "DASHBOARD" &&
      props.title !== "All Requests"){

    if(props.private){
      icon = <i className="material-icons channel-icon private">lock</i>
    } else {
      icon = <span className="hash">#</span>
    }

  }

  return (
    <div className={className} onClick={()=>{
        props.updateView(props.title, props.id)
      }}>
      {icon}
      <p className="name" >{props.title}</p>
    </div>
  );
}

export default Selector;
