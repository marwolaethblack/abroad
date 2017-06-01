import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';
import { beautifyUrlSegment, spaceToDash } from '../services/textFormatting';


class RelatedPost extends Component {
    render() {
        const { upvotes,_id,title,category, comments, country_from, country_in, isAnswered } = this.props;

        return(
        	<div>        	
	        	<Link to={`/posts/${_id}/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`}><h3>{title}</h3></Link>
                <p>{country_from + " > " + country_in}</p>
	        	<p>{"Category: " + category}</p>
                { isAnswered && <span style={{color:'green',fontSize:'1.2em',fontWeight:'bold'}}>Answered <br /></span> }
                <span>Upvotes {upvotes}</span> &nbsp;
                <span>Comments {comments.length}</span>
        	</div>
        );
    }
}

export default RelatedPost;