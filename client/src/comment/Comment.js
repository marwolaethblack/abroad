import React, { Component } from 'react';
import postDateDiff from '../services/dateDifference';
import EditCommentForm from './EditCommentForm';
import ReplyCommentForm from './ReplyCommentForm';
import Modal from '../widgets/Modal';
import { Link } from 'react-router';
import { spaceToDash } from '../services/textFormatting';


class Comment extends Component {
    constructor(){
        super();
        this.state = {
            isEditCommentModalOpen: false,
            isReplyModalOpen: false
        }
        this.openEditCommentModal = this.openEditCommentModal.bind(this);
        this.closeEditCommentModal = this.closeEditCommentModal.bind(this);
        this.openReplyModal = this.openReplyModal.bind(this);
        this.closeReplyModal = this.closeReplyModal.bind(this);
    }

    renderComments = (comments) => {
        if(comments !== undefined) {
            if(comments.length !== 0)
            {
               const { deleteComment, editComment, postId, authenticated } = this.props;
              return comments.map(comment => <Comment {...comment} 
                                            deleteComment={deleteComment} 
                                            editComment={editComment} 
                                            postId={postId} 
                                            key={comment._id} 
                                            authenticated={authenticated}
                                            />) 
            }
          } 
          return "";
    }

    handleDeleteClick = (deleteComment,id) => {
        deleteComment(id);
    }

  openEditCommentModal = () => {
        this.setState({ isEditCommentModalOpen: true });
  }

  closeEditCommentModal = () => {
        this.setState({ isEditCommentModalOpen: false });
  }

  openReplyModal = () => {
        this.setState({ isReplyModalOpen: true });
  }

  closeReplyModal = () => {
        this.setState({ isReplyModalOpen: false });
  }

    render() {
        const { isPostAuthor, authenticated, upvotes, _id, author, postId, comments, content, deleteComment, editComment, parents } = this.props;
        const datePosted = postDateDiff(_id);
        const loggedUserId = localStorage.getItem('id');
        return(
        	<article className="extended-post-comment">
            <div className={author === loggedUserId ? "own-comment whole-comment" : "whole-comment"}>
  	        	<span>Upvotes {upvotes}</span>
                  <section className="comment-content">
                  { content }
                  </section>
  	        	<span>Submitted {datePosted} ago by <Link to={`/user/${author}/${spaceToDash(author.username)}`}>{author.username}</Link></span>
                <div>
                  {(parents.length === 1 && isPostAuthor) && <button onClick={()=>{alert("answered");}}>Mark as answered</button> }
                  {authenticated && <button style={{color:"blue"}} onClick={this.openReplyModal}>REPLY</button> }
                  {author._id === loggedUserId && <button style={{color:"green"}} onClick={this.openEditCommentModal}>EDIT COMMENT</button> }
                  {author._id === loggedUserId && <button style={{color:"red"}}  onClick={()=>{this.handleDeleteClick(deleteComment, _id);}}>Delete</button> }
                </div>
  	        	<span>{comments !== undefined && comments.length} comments</span>
            </div>
                 <section className={`replies-${parents.length}`}>
                    {this.renderComments(comments)}
                </section>


            <Modal isOpen={this.state.isEditCommentModalOpen} 
                   onClose={this.closeEditCommentModal} 
                   title="EDIT COMMENT">

                <EditCommentForm 
                 commentId={_id} 
                 authorId={author._id} 
                 postId={postId}
                 editComment={editComment}
                 afterSubmit={this.closeEditCommentModal}
                 commentContent={content} />

            </Modal>

            <Modal isOpen={this.state.isReplyModalOpen} 
                   onClose={this.closeReplyModal} 
                   title="REPLY">

                <ReplyCommentForm 
                     commentId={_id} 
                     postId={postId} 
                     afterSubmit={this.closeReplyModal}
                 />

            </Modal>

        	</article>
        );
    }
}

export default Comment;