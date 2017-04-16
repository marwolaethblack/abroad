import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost, deleteComment } from '../actions';
import ExtendedPost from '../components/pages/ExtendedPost';
import Loader from '../components/parts/Loader';


class ExtendedPostPage extends Component {

  componentDidMount() {
      this.props.loadPost({id: this.props.params.id});
  }
  
  render() {
    const { singlePost, loading, authenticated, removeComment } = this.props;
    const isEmpty = Object.keys(singlePost).length === 0;
    if(loading) {
        return (<Loader />);
    } else {
      if(isEmpty) {
        return (<h1>No post found</h1>)
      }
      return (<ExtendedPost {...singlePost} authenticated={authenticated} deleteComment={removeComment}/>);
    } 
  }
}

const mapStateToProps = (state) => {
  return {
    singlePost: state.singlePost,
    loading: state.isFetching,
    authenticated: state.auth.authenticated
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadPost(id) {
          dispatch(fetchSinglePost(id));
        },
        removeComment(commentId) {
          dispatch(deleteComment(commentId));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExtendedPostPage);