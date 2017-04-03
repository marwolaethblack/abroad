import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost } from '../actions';
import ExtendedPost from '../components/pages/ExtendedPost';
import Loader from '../components/parts/Loader';


class ExtendedPostPage extends Component {

  componentDidMount() {
      this.props.loadPost({id: this.props.params.id});
  }
  
  render() {
    const { singlePost, loading } = this.props;
    const isEmpty = Object.keys(singlePost).length === 0;
    if(loading) {
        return (<Loader />);
    } else {
      if(isEmpty) {
        return (<h1>No post found</h1>)
      }
      return (<ExtendedPost {...singlePost}/>);
    } 
  }
}

const mapStateToProps = (state) => {
  return {
    singlePost: state.singlePost,
    loading: state.isFetching
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadPost(id) {
          dispatch(fetchSinglePost(id));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExtendedPostPage);