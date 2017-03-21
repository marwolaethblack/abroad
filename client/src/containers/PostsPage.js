import React, { Component, PropTypes } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import { fetchPosts, filterUpdate } from '../actions';

import SearchFilter from '../components/SearchFilter';
import SortFilter from '../components/SortFilter';
import AllPosts from '../components/AllPosts';


class PostsPage extends Component {
  
  componentWillMount() {
      this.props.loadPosts(this.props.filterQuery);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location.query !== this.props.location.query){
        this.props.loadPosts(this.props.filterQuery);
    }
  }
  
  render() {
    const { posts } = this.props;

    return (
    <section>

        <SearchFilter 
         query={this.props.filterQuery}
         filterUpdate={this.props.updateFilterValue} 
         getPosts={this.props.loadPosts} />

        <SortFilter />

        { (posts.length > 0) ? 
          <AllPosts posts={this.props.posts} /> :
          <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>
        }

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