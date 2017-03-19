import React, { Component } from 'react';
import { Link } from 'react-router';

class Post extends Component {
    render() {
        return(
        	<article>
	        	<span>Upvotes {this.props.upvotes}</span>
	        	<img src={this.props.img}/>
	        	<Link to={`posts/${this.props.id}`}><h3>{this.props.title}</h3></Link>
	        	<span>Submitted {this.props.date} ago by {this.props.author} to {this.props.category}</span>
	        	<span>{this.props.comments.length}</span>
        	</article>
        );
    }
}

export default Post;