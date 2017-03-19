import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions';
import FrontPageTitle from '../components/parts/FrontPageTitle';
import FrontPagePosts from '../components/FrontPagePosts';
import SimplePostFilter from '../components/SimplePostFilter';

class FrontPage extends Component {
  
  componentDidMount(){
    this.props.loadPosts();
  }
  
  render() {
    return (
      <div>
      FRONT PAGE CONTAINER
        <FrontPageTitle />
        <SimplePostFilter />
        <FrontPagePosts posts={this.props.posts} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadPosts: () => {
      dispatch(fetchPosts());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(FrontPage);