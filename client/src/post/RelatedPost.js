import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';


class RelatedPost extends Component {
    render() {
        const { upvotes,_id,title,category, comments, country_from, country_in } = this.props;

        return(
        	<div>        	
	        	<Link to={`/posts/view/${_id}/${title}`}><h3>{title}</h3></Link>
                <p>{country_from + " > " + country_in}</p>
	        	<p>{"Category: " + category}</p>
                <span>Upvotes {upvotes}</span> &nbsp;
                <span>Comments {comments.length}</span>
        	</div>
        );
    }
}

export default RelatedPost;