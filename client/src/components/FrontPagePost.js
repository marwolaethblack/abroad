import React, { Component, PropTypes } from 'react';
import postDateDiff from '../services/dateDifference';

class FrontPagePost extends Component {
    
  render() {
    const { title,content,category,author,_id } = this.props;
    const datePosted = postDateDiff(_id);
    console.log("FrontPagePost RENDER");
    return (
      <div>
        <h2>{ title }</h2>
        <h4>{ category }</h4>
        <p>{ content }</p>
        <span>Posted {datePosted} ago</span>
        <p>Author: {author !== undefined && author.username}</p>
      </div>
    )
  }
}

export default FrontPagePost;

