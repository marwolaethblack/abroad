import React, { Component, PropTypes } from 'react';
import postDateDiff from '../../services/dateDifference';
import Comment from '../Comment';
import AddComment from '../parts/AddComment';

class ExtendedPost extends Component {

  renderComments = (comments) => {
            if(comments.length !== 0)
            {
               return comments.map(comment => <Comment {...comment} key={comment._id}/>) 
            }
        return "No comments to show";
  }
    
  render() {
    const { upvotes, image, title, content, category, author, comments, _id } = this.props;
    const datePosted = postDateDiff(_id);

  
    return (
      <article>
        <span>Upvotes {upvotes}</span>
            <img alt={title} src={image}/>
            <p>{_id}</p>
            <h3>{title}</h3>
            <span>Submitted {datePosted} ago by {author.username } to {category}</span>
            <span>{comments.length}</span>
            <section className="post-content">
              { content }
            </section>
            <section className="post-comments">
              <AddComment />
              {this.renderComments(comments)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;

