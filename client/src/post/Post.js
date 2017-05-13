import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';
import { beautifyUrlSegment, spaceToDash } from '../services/textFormatting';


class Post extends Component {
    render() {
        const { upvotes,image,_id,title,author,comments,category, country_in } = this.props;
        const datePosted = postDateDiff(_id);

        return(
        	<article className="allposts-post">
	        	<span>Upvotes {upvotes}</span>
	        	<img src={image} alt={title} />
	        	<Link to={`/posts/${_id}/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`}><h3>{title}</h3></Link>
	        	<span>Submitted {datePosted} ago by {author !== undefined && author.username } to {category}</span>
	        	<p>Comments: {comments !== undefined&& comments.length}</p>
        	</article>
        );
    }
}

export default Post;