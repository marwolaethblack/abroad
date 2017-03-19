import React, { Component, PropTypes } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import { fetchPosts, filterUpdate } from '../actions';

import SearchFilter from '../components/SearchFilter';
import SortFilter from '../components/SortFilter';
import Post from '../components/Post.js';


class PostsPage extends Component {
  
  componentDidMount() {
      this.props.loadPosts(this.props.filterQuery);
  }
  
  render() {
    return (
    <section>

        <SearchFilter 
         query={this.props.filterQuery}
         filterUpdate={this.props.updateFilterValue} 
         getPosts={this.props.loadPosts} />

        <SortFilter />
        <div className="posts-page">
           {this.props.posts.map((post,index) => <Post key={post._id} {...post} /> )}
        </div>
    </section>
    )
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  filterQuery: state.filter
});

const mapDispatchToProps = (dispatch) => {
    return {
        loadPosts(query) {
          dispatch(fetchPosts(query));
        },
        updateFilterValue(name,value){
          dispatch(filterUpdate(name,value));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PostsPage);