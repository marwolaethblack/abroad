import React, { Component } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../helpers/dateDifference';
import { beautifyUrlSegment, spaceToDash } from '../helpers/textFormatting';


class RelatedPost extends Component {
    render() {
        const { upvotes,id,title,category, comments, countryFrom, countryIn, isAnswered } = this.props;

        return(
        	<div>        	
	        	<Link to={`/posts/${id}/${spaceToDash(countryIn)}/${category}/${beautifyUrlSegment(title)}`}><h3>{title}</h3></Link>
                <p>{countryFrom + " > " + countryIn}</p>
	        	<p>{"Category: " + category}</p>
                { isAnswered && <span style={{color:'green',fontSize:'1.2em',fontWeight:'bold'}}>Answered <br /></span> }
                <span>Upvotes {upvotes}</span> &nbsp;
                
        	</div>
        );
    }
}
//comments of a related post
// <span>Comments {comments.length}</span>
export default RelatedPost;