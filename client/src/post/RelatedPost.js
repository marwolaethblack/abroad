import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';


class RelatedPost extends Component {
    render() {
        const { upvotes,_id,title,category } = this.props;

        return(
        	<li>        	
	        	<Link to={`/posts/view/${_id}/${title}`}><h3>{title}</h3></Link>
	        	<span>{category}</span> &nbsp;
                <span>Upvotes {upvotes}</span>
        	</li>
        );
    }
}

export default RelatedPost;