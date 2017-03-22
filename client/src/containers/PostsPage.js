import React, { Component, PropTypes } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import { fetchPosts, filterUpdate } from '../actions';

import SearchFilter from '../components/SearchFilter';
import SortFilter from '../components/SortFilter';
import AllPosts from '../components/AllPosts';
import categories from '../constants/categories'


class PostsPage extends Component {
  
  componentDidMount() {
      const urlQuery = this.props.location.query;
      this.props.loadPosts(urlQuery);

      Object.keys(urlQuery).forEach(filterKey => {
        if(filterKey === "category" && urlQuery.category.indexOf("All") > -1){
          urlQuery[filterKey] = categories;
        }
        this.props.updateFilterValue(filterKey,urlQuery[filterKey]);
      });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location.query !== this.props.location.query){
        this.props.loadPosts(this.props.location.query);
    }
  }
  
  render() {
    const { posts, isFetching } = this.props;

    return (
      <section>

          <SearchFilter 
           stateQuery={this.props.stateQuery}
           filterUpdate={this.props.updateFilterValue} />

          <SortFilter />
          {
            isFetching ?
            <span style={{fontSize:"2em",color:"red"}}>loading posts</span> :
            <AllPosts posts={this.props.posts} />
          }


      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  stateQuery: state.filter,
  isFetching: state.isFetching
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