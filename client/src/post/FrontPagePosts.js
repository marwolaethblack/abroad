import React, { Component, PropTypes } from 'react';
import FrontPagePost from './FrontPagePost';

class FrontPagePosts extends Component {
    
    render() {
    return (
      <div id="front-page-posts" className="container">
        {this.props.posts.map(post => 
            <FrontPagePost
             key={post._id} 
             {...post} />
        )}
      </div>
    );
  }
}

FrontPagePosts.propTypes = {
	posts: PropTypes.arrayOf(PropTypes.shape({
	    title: PropTypes.string.isRequired,
	    category: PropTypes.string.isRequired,
	    content: PropTypes.string.isRequired,
	    country_from: PropTypes.string.isRequired,
	    country_in: PropTypes.string.isRequired,
	    _id: PropTypes.string.isRequired
  })).isRequired
}

export default FrontPagePosts;