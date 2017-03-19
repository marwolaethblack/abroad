import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

class Post extends Component {
    render() {

        const { upvotes,downvotes,img,_id,title,author,comments,category } = this.props;
        const date = new Date(parseInt(_id.substring(0, 8), 16) * 1000);
        const diff = moment.preciseDiff(date, moment(), true); 
        console.log(diff);

        return(
        	<article>
	        	<span>Upvotes: {upvotes}</span>
                <span>Downvotes: {downvotes}</span>
	        	<img src={img}/>
	        	<Link to={`posts/${_id}/${title}`}><h3>{title}</h3></Link>
	        	<span>Submitted {this.props.date} ago by {author.username} to {category}</span>
	        	<span>{comments.length}</span>
        	</article>
        );
    }
}

export default Post;