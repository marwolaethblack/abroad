import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';
import Comment from '../comment/Comment';
import AddComment from '../comment/AddComment';
import Modal from '../widgets/Modal';
import EditPostForm from './EditPostForm';
import ReplyCommentForm from '../comment/ReplyCommentForm';


class ExtendedPost extends Component {

  componentWillMount() { 
    const { socket }  = this.props;
    socket.emit('roomPost', this.props._id);
    socket.on('add comment', (payload) => this.props.socketAddComment(payload));
  }

  constructor(){
    super();
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.openEditPostModal = this.openEditPostModal.bind(this);
    this.closeEditPostModal = this.closeEditPostModal.bind(this);
    
    this.state = {
      isEditPostModalOpen: false
    }
  }

  renderComments = (comments, deleteComment) => {
            if(comments.length !== 0)
            {
               return comments.map(comment => 
                <Comment {...comment} 
                         key={comment._id}
                         postId={this.props._id}
                         deleteComment={deleteComment} 
                         editComment={this.props.editComment}
                         authenticated={this.props.authenticated} />) 
            }
        return "No comments to show";
  }

  handleDeletePost = () => {
        this.props.deletePost(this.props._id);
  }

  openEditPostModal = () => {
        this.setState({ isEditPostModalOpen: true });
  }

  closeEditPostModal = () => {
        this.setState({ isEditPostModalOpen: false });
  }
    
  render() {
    const { upvotes, image, title, content, category, author, _id, deleteComment, editPost, country_from, country_in } = this.props;
    const comments = this.props.comments || [];
    const { authenticated } = this.props;
    const datePosted = postDateDiff(_id);
    const loggedUserId = localStorage.getItem('id');

  
    return (
      <article className="extended-post">

        <Modal isOpen={this.state.isEditPostModalOpen} 
               onClose={this.closeEditPostModal}
               title="EDIT POST">

          <EditPostForm postId={_id} 
            authorId={author.id} 
            editPost={editPost}
            onSubmitted={this.closeEditPostModal}
            postContent={content} />

        </Modal>

        <span>Upvotes {upvotes}</span>
            <img alt={title} src={image}/>
            <h1>{title}</h1>
            <p>{country_from + " > " + country_in}</p>
            <span>Submitted {datePosted} ago by <Link to={`/user/${author.id}`}>{author.username }</Link> to {category}</span>
            <section className="post-content">
              { content }
            </section>
        { loggedUserId === author.id && <button onClick={this.handleDeletePost}>DELETE POST</button> }
        { loggedUserId === author.id && <button onClick={this.openEditPostModal}>EDIT POST</button> }
            <section className="post-comments">
              <span>{comments.length + " comments"}</span>
              {authenticated ? <AddComment /> : <Link to="/signin">Sign in to add a comment.</Link>}
              {this.renderComments(comments, deleteComment)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;