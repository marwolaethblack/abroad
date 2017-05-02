import React, { Component, PropTypes } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router';
import postDateDiff from '../../services/dateDifference';
import Comment from '../Comment';
import AddComment from '../parts/AddComment';
import Modal from '../parts/Modal';
import EditPostForm from '../EditPostForm';



class ExtendedPost extends Component {

  layerComments = (comments) => {
    console.log(comments);
    const sort = function (a, b) {
      if (a.parents.length < b.parents.length) {
        return 1;
      }
      if (a.parents.length > b.parents.length) {
        return -1;
      }
      // a must be equal to b
      return 0;
    };

    comments.sort(sort);

    comments.forEach(comment => {
        //ignore root comment with no parents
        if(comment.parents.length > 1) {
            const parentId = comment.parents[comment.parents.length - 2];
            // Get the parent comment based on the next-to-last
            // comment ID in this comment's parents
            const parentCommentIndex = comments.findIndex(x => x._id === parentId);
            console.log("before");
            console.log(comments);
            if(parentCommentIndex > -1) {
                comments[parentCommentIndex].comments.push(comment);
                comments.splice(comments.indexOf(comment), 1); 
                console.log("after");
                console.log(comments);
           }

        }
        
    });
    return comments;
  }

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

  componentDidMount(){

    // this.setState({comments: this.layerComments(this.props.comments)});
    this.setState({comments: this.props.comments});
  }

  arraysAreEqual = (arr1, arr2) => 
    arr1.length == arr2.length && arr1.every((element, index) => element === arr2[index] );

  componentDidUpdate(prevProps){
    if( !this.arraysAreEqual(prevProps.comments,this.props.comments) ){
      // this.setState({comments: this.layerComments(this.props.comments)});
      this.setState({comments: this.props.comments});

    }
    console.log("prevProps");
    console.log(prevProps);
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
    let comments = this.state.comments || [];
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