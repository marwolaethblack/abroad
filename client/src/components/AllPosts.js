import React, { Component, PropTypes } from 'react';
import Post from '../components/Post';
import Pagination from '../components/parts/Pagination';

class AllPosts extends Component {
    
  render() {
  	const { posts } = this.props;
  	const perPage = 1;

    return (
     <div className="posts-page container">
     	{ posts.map((post,index) => <Post key={post._id} {...post} />) }
     	{ (posts.length > perPage) && <Pagination elementsNo={posts.length} perPage={perPage} /> }
     </div>
    )
  }
}

export default AllPosts;

AllPosts.propTypes = {
	posts: PropTypes.array
}