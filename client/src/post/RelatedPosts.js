import React, { Component, PropTypes } from 'react';
import RelatedPost from './RelatedPost';

class RelatedPosts extends Component {
  
  render() {
  	const { relatedPosts } = this.props;

    return (
      <div>
       <h3>Related Posts</h3>
       <div className="related-posts">
          
          {relatedPosts.map(post => 
               <RelatedPost key={post._id} {...post} />
          )}       
       </div>
      </div>
    )
  }
}

export default RelatedPosts;

RelatedPosts.propTypes = {
	posts: PropTypes.array
}