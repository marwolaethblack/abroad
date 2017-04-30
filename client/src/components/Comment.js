import React, { Component } from 'react';
import postDateDiff from '../services/dateDifference';
import EditCommentForm from './EditCommentForm';
import Modal from './parts/Modal';


class Comment extends Component {
    constructor(){
        super();
        this.state = {
            isEditCommentModalOpen: false
        }
        this.openEditCommentModal = this.openEditCommentModal.bind(this);
        this.closeEditCommentModal = this.closeEditCommentModal.bind(this);
    }

    renderComments = (comments) => {
        if(comments !== undefined) {
            if(comments.length !== 0)
            {
               return comments.map(comment => <Comment {...comment} key={comment._id}/>) 
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

    render() {
        const { upvotes, _id, author, postId, comments, content, deleteComment, editComment } = this.props;
        const datePosted = postDateDiff(_id);
        const loggedUserId = localStorage.getItem('id');
        return(
        	<article className={author.id === loggedUserId && "own-comment"}>
	        	<span>Upvotes {upvotes}</span>
                <section>
                { content }
                </section>
	        	<span>Submitted {datePosted} ago by {author !== undefined && author.username }</span>
                {author.id === loggedUserId && <span style={{color:"blue", cursor:"pointer"}} onClick={()=>{this.handleDeleteClick(deleteComment, _id);}}>Delete</span> }
                {author.id === loggedUserId && <button onClick={this.openEditCommentModal}>EDIT COMMENT</button> }
	        	<span>{comments !== undefined && comments.length} comments</span>
                 <section className="comment-comments">
                    {this.renderComments(comments)}
                </section>


            <Modal isOpen={this.state.isEditCommentModalOpen} 
                   onClose={this.closeEditCommentModal} 
                   title="EDIT COMMENT">

                <EditCommentForm 
                 commentId={_id} 
                 authorId={author.id} 
                 postId={postId}
                 editComment={editComment} 
                 commentContent={content} />

            </Modal>

        	</article>
        );
    }
}

export default Comment;