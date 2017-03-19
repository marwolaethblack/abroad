import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions';

import SearchFilter from '../components/SearchFilter';
import SortFilter from '../components/SortFilter';
import Post from '../components/Post.js';


class PostsPage extends Component {
  
  componentDidMount() {
      this.props.loadPosts();
  }
  
  render() {
    return (
    <section>
        <SearchFilter />
        <SortFilter />
        <div className="posts-page">
           {this.props.posts.map((post,index) => <Post {...post} key={post.id}/> )}
        </div>
    </section>
    )
  }
}

const mapStateToProps = (state) => ({
  test: "Test text in mapStateToProps",
  posts: state.posts
});

const mapDispatchToProps = (dispatch) => {
    return {
        loadPosts: () => {
      dispatch(fetchPosts());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(PostsPage);