import React, { Component } from 'react';
import { Link } from 'react-router';
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

    render() {
        const { upvotes, _id,author,comments, content} = this.props;
        const datePosted = postDateDiff(_id);
        return(
        	<article>
	        	<span>Upvotes {upvotes}</span>
                <section>
                { content }
                </section>
	        	<span>Submitted {datePosted} ago by {author !== undefined && author.username }</span>
	        	<span>{comments !== undefined&& comments.length}</span>
                 <section className="comment-comments">
                    {this.renderComments(comments)}
                </section>
        	</article>
        );
    }
}

export default Comment;