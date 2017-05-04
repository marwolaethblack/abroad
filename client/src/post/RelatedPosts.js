import React, { Component, PropTypes } from 'react';
import RelatedPost from './RelatedPost';

class RelatedPosts extends Component {
  
  render() {
  	const { relatedPosts } = this.props;

    return (
     <div className="posts-page container">
        <h3>Related Posts</h3>
        {relatedPosts.map(post => 
             <RelatedPost key={post._id} {...post} />
        )}       

     </div>
    )
  }
}

export default RelatedPosts;

RelatedPosts.propTypes = {
	posts: PropTypes.array
}