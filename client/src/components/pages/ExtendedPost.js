import React, { Component, PropTypes } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router';
import postDateDiff from '../../services/dateDifference';
import Comment from '../Comment';
import AddComment from '../parts/AddComment';



class ExtendedPost extends Component {

  componentWillMount() { 
    const { socket }  = this.props;
    console.log(this.props);
    socket.on('add comment', (payload) => this.props.socketAddComment(payload));

  }

  renderComments = (comments, deleteComment) => {
            if(comments.length !== 0)
            {
               return comments.map(comment => <Comment {...comment} key={comment._id} deleteComment={deleteComment} />) 
            }
        return "No comments to show";
  }
    
  render() {
    const { upvotes, image, title, content, category, author, comments, _id, deleteComment } = this.props;
    const { authenticated } = this.props;
    const datePosted = postDateDiff(_id);

  
    return (
      <article>
        <span>Upvotes {upvotes}</span>
            <img alt={title} src={image}/>
            <h3>{title}</h3>
            <span>Submitted {datePosted} ago by {author.username } to {category}</span>
            <span>{comments.length}</span>
            <section className="post-content">
              { content }
            </section>
            <section className="post-comments">
              {authenticated ? <AddComment /> : <Link to="/signin">Sign in to add a comment.</Link>}
              {this.renderComments(comments, deleteComment)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;

