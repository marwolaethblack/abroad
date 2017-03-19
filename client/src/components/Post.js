import React, { Component } from 'react';
import { Link } from 'react-router';

class Post extends Component {
    render() {
        return(
// <<<<<<< HEAD
//         	<div>
// 	        	<h2>{this.props.title}</h2>
// 	        	<h4>{this.props.category}</h4>
// 	        	<p>{this.props.content}</p>
// 	        	<ul>
// 	        		<li>upvotes: {this.props.upvotes}</li>
// 	        		<li>downvotes: {this.props.downvotes}</li>
// 	        	</ul>
//         	</div>
        	<article>
	        	<span>Upvotes {this.props.upvotes}</span>
	        	<img src={this.props.img}/>
	        	<Link to={`posts/${this.props.id}`}><h3>{this.props.title}</h3></Link>
	        	<span>Submitted {this.props.date} ago by {this.props.author.username} to {this.props.category}</span>
	        	<span>{this.props.comments.length}</span>
        	</article>
        );
    }
}

export default Post;