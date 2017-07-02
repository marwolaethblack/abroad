import React, { Component } from 'react';
import Linkify from 'react-linkify';
import postDateDiff from '../helpers/dateDifference';
import EditCommentForm from './EditCommentForm';
import ReplyCommentForm from './ReplyCommentForm';
import Modal from '../widgets/Modal';
import { Link } from 'react-router';
import { spaceToDash } from '../helpers/textFormatting';


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
        this.markPostAsAnswered = this.markPostAsAnswered.bind(this);
        this.removePostAnswer = this.removePostAnswer.bind(this);
        
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

  markPostAsAnswered = (postId, commentId, authorId) => {
    this.props.answerPost(postId, commentId, authorId);
  }

  removePostAnswer = (postId, commentId, authorId) => {
    this.props.removePostAnswer(postId, commentId, authorId);
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
        const { isPostAuthor, isPostAnswered, authenticated, upvotes, _id, author, postId, comments, isAnswer, content, deleteComment, editComment, markPostAsAnswered, parents } = this.props;
        const datePosted = postDateDiff(_id);
        const loggedUserId = localStorage.getItem('id');
        return(
        	<article className="extended-post-comment">
            <div className={`whole-comment ${ isAnswer && 'answer' } ${ author._id === loggedUserId && 'own-comment' } `}>
  	        	<span>Upvotes {upvotes}</span>
                  <section className="comment-content">
                    <Linkify properties={{target: '_blank'}}>
                      { content }
                    </Linkify>
                  </section>
  	        	<span>Submitted {datePosted} ago by <Link to={`/user/${author}/${spaceToDash(author.username)}`}>{author.username}</Link></span>
                <div>
                  {(parents.length === 1 && isPostAuthor && !isPostAnswered) && <button onClick={()=>{this.markPostAsAnswered(postId, _id, loggedUserId);}}>Mark as answered</button> }
                  {(parents.length === 1 && isPostAuthor && isAnswer) && <button onClick={()=>{this.removePostAnswer(postId, _id, loggedUserId);}}>Remove the answer</button> }
                  {authenticated && <button style={{color:"blue"}} onClick={this.openReplyModal}>REPLY</button> }
                  {(author._id === loggedUserId && !isAnswer) && <button style={{color:"green"}} onClick={this.openEditCommentModal}>EDIT COMMENT</button> }
                  {(author._id === loggedUserId && !isAnswer) && <button style={{color:"red"}}  onClick={()=>{this.handleDeleteClick(deleteComment, _id);}}>Delete</button> }
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