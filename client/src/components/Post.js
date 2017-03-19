import React, { Component } from 'react';
import { Link } from 'react-router';

class Post extends Component {
    render() {
        return(
        	<article>
	        	<span>Upvotes {this.props.upvotes}</span>
	        	<img src={this.props.image}/>
	        	<Link to={`posts/view/${this.props._id}/${this.props.title}`}><h3>{this.props.title}</h3></Link>
	        	<span>Submitted {this.props.date} ago by {this.props.author.username} to {this.props.category}</span>
	        	<span>{this.props.comments.length}</span>
        	</article>
        );
    }
}

export default Post;