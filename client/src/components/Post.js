import React, { Component } from 'react';
import { Link } from 'react-router';

class Post extends Component {
    render() {
        const {upvotes, image, _id, title, date, author, category, comments} = this.props;
        return(
        	<article>
	        	<span>Upvotes {upvotes}</span>
	        	<img src={image}/>
	        	<Link to={`posts/view/${_id}/${title}`}><h3>{title}</h3></Link>
	        	<span>Submitted {date} ago by {author !== undefined&& author.username } to {category}</span>
	        	<span>{comments !== undefined&& comments.length}</span>
        	</article>
        );
    }
}

export default Post;