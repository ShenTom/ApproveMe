import React from 'react';
import './RequestBar.css'

const RequestBar = (props) => {
  let style;
  let buttonStyle;
  let textStyle;
  if(props.inFocus){
    style = {backgroundColor: "rgb(63,179,79)"};
    buttonStyle = {color: "white"};
    textStyle = {color: "white"};
  }
  return(
    <div className="request-bar-container" style={style} onClick={(e)=>{
      props.handlePress(props.request,e);
      e.stopPropagation();
    }}>
      <div className="left">
        <i className="incomplete material-icons complete-icon" style={buttonStyle} onClick={(e)=>{
          alert("fdfsdf");
          e.stopPropagation()
        }}>check_circle</i>
        <p style={textStyle}>{props.request.event}</p>
      </div>
      <div className="right">
        <i className="material-icons avatar empty">person</i>
      </div>
    </div>
  );
}

export default RequestBar;
