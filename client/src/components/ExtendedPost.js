import React, { Component } from 'react';

class ExtendedPost extends Component {
    
  render() {
    const { title,content,category } = this.props;
    
    return (
      <div>
        <h2>{ title }</h2>
        <h4>{ category }</h4>
        <p>{ content }</p>
      </div>
    )
  }
}

export default FrontPagePost;

