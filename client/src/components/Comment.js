import React, { Component } from 'react';
import postDateDiff from '../services/dateDifference';


class Comment extends Component {
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

    render() {
        const { upvotes, _id, author, comments, content, deleteComment } = this.props;
        const datePosted = postDateDiff(_id);
        const loggedUserId = localStorage.getItem('id');
        return(
        	<article id={_id} >
	        	<span>Upvotes {upvotes}</span>
                <section>
                { content }
                </section>
	        	<span>Submitted {datePosted} ago by {author !== undefined && author.username }</span>
                {author.id === loggedUserId&& <a href="" onClick={(e)=>{e.preventDefault(); this.handleDeleteClick(deleteComment, _id);}}>Delete</a> }
	        	<span>{comments !== undefined&& comments.length}</span>
                 <section className="comment-comments">
                    {this.renderComments(comments)}
                </section>
        	</article>
        );
    }
}

export default Comment;