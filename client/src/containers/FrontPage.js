import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts,filterUpdate } from '../actions';
import FrontPageTitle from '../components/parts/FrontPageTitle';
import FrontPagePosts from '../components/FrontPagePosts';
import SimplePostFilter from '../components/SimplePostFilter';

class FrontPage extends Component {
  
  componentDidMount(){
    this.props.loadPosts(this.props.filterQuery);
  }
  
  render() {
    return (
      <div>
        <FrontPageTitle />
        <SimplePostFilter query={this.props.filterQuery} filterUpdate={this.props.updateFilterValue} />
        <FrontPagePosts posts={this.props.posts} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  filterQuery: state.filter
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts(query){
    dispatch(fetchPosts(query));
  },
  updateFilterValue(name,value){
    dispatch(filterUpdate(name,value));
  }
});


export default connect(mapStateToProps,mapDispatchToProps)(FrontPage);