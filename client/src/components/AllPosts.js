import React, { Component, PropTypes } from 'react';
import Post from '../components/Post';

class AllPosts extends Component {
    
  render() {
    return (
     <div className="posts-page">
           {this.props.posts.map((post,index) => <Post key={post._id} {...post} /> )}
     </div>
    )
  }
}

export default AllPosts;

AllPosts.propTypes = {
	posts: PropTypes.array
}