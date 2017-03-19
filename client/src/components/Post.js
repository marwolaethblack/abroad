import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';


class Post extends Component {
    render() {
        const { upvotes,downvotes,img,_id,title,author,comments,category } = this.props;
        const datePosted = postDateDiff(_id);
        
        return(
        	<article>
	        	<span>Upvotes {upvotes}</span>
	        	<img src={image}/>
	        	<Link to={`posts/view/${_id}/${title}`}><h3>{title}</h3></Link>
	        	<span>Submitted {datePosted} ago by {author !== undefined && author.username } to {category}</span>
	        	<span>{comments !== undefined&& comments.length}</span>
        	</article>
        );
    }
}

export default Post;