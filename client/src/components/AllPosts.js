import React, { Component, PropTypes } from 'react';
import Post from '../components/Post';

class AllPosts extends Component {
    
  render() {
  	const { posts } = this.props;

    return (
     <div className="posts-page container">
     	{ (posts.length > 0) ?
		   posts.map((post,index) => <Post key={post._id} {...post} /> ) :
		  <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>
     	}
     </div>
    )
  }
}

export default AllPosts;

AllPosts.propTypes = {
	posts: PropTypes.array
}