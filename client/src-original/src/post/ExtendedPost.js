import React, { Component, PropTypes } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router';
import postDateDiff from '../../services/dateDifference';
import Comment from '../Comment';
import AddComment from '../parts/AddComment';
import Modal from '../parts/Modal';
import EditPostForm from '../EditPostForm';



class ExtendedPost extends Component {


  componentWillMount() { 
    const { socket }  = this.props;
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
    const { upvotes, image, title, content, category, author, _id, deleteComment, editPost } = this.props;
    const comments = this.props.comments || [];
    const { authenticated } = this.props;
    const datePosted = postDateDiff(_id);
    const loggedUserId = localStorage.getItem('id');

  
    return (
      <article>
 
        { loggedUserId === author.id && <button onClick={this.handleDeletePost}>DELETE POST</button> }
        { loggedUserId === author.id && <button onClick={this.openEditPostModal}>EDIT POST</button> }

        <Modal isOpen={this.state.isEditPostModalOpen} 
               onClose={this.closeEditPostModal} 
               title="EDIT POST">

          <EditPostForm postId={_id} 
            authorId={author.id} 
            editPost={editPost} 
            postContent={content} />

        </Modal>

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