import React from 'react';
import './FooterInput.css'

const FooterInput = (props) => {
  return(
    <div className="comment-input-container">
      <textarea
        type="text"
        placeholder="Add a comment..."
        title="Add a comment [M]"
        className="comment-box"
        onKeyDown={(event)=>{
          if(event.keyCode === 13){
            props.handleCommentSubmit(event);
            event.preventDefault();
            event.target.value = "";
          }
        }}>
      </textarea>
    </div>
  )
}

export default FooterInput;
