import React, { Component } from 'react';
import postDateDiff from '../services/dateDifference';
import Comment from './Comment';

class ExtendedPost extends Component {

  constructor(){
    super();
    this.renderComments = this.renderComments.bind(this);
  }

  renderComments = (comments) => {
        if(comments !== undefined) {
            if(comments.length !== 0)
            {
               return comments.map(comment => <Comment {...comment} />) 
            }
        }
        return "No comments to show";
}
    
  render() {
    const { upvotes, image, title, content, category, date, author, comments, _id } = this.props;
    const datePosted = (_id !== undefined) ? postDateDiff(_id) : "";

  
    return (
      <article>
        <span>Upvotes {upvotes}</span>
            <img src={image}/>
            <p>{_id}</p>
            <h3>{title}</h3>
            <span>Submitted {datePosted} ago by {author !== undefined&& author.username } to {category}</span>
            <span>{comments !== undefined&& comments.length}</span>
            <section className="post-content">
            { content }
            </section>
            <section className="post-comments">
            {this.renderComments(comments)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;

