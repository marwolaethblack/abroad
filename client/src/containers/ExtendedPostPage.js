import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchSinglePost, editPost, deletePost, deleteComment } from '../actions';
import RelatedPosts from '../components/RelatedPosts';
import ExtendedPost from '../components/pages/ExtendedPost';
import Loader from '../components/parts/Loader';

 
class ExtendedPostPage extends Component {

  componentDidMount() {   
      this.props.loadPost({id: this.props.params.id});   
  }

  componentDidUpdate(prevProps) {
    if(!this.props.loading && this.props.relatedPosts.length === 0){

    }
    //loads a new post if url changes
    const currentPathname = this.props.location.pathname;

    if(prevProps.location.pathname !== currentPathname){    
       this.props.loadPost({id: this.props.params.id});
    }
  }
  
  render() {

    const { singlePost, relatedPosts, loading, authenticated, removeComment, removePost, updatePost, socketAddComment, socket } = this.props;

    const isEmpty = Object.keys(singlePost).length === 0;
    if(loading.posts) {
        return (<Loader />);
    } else {
      if(isEmpty) {
        return (<h1>No post found</h1>)
      }

      return (
        <div>
          <ExtendedPost {...singlePost} 
                        authenticated={authenticated}
                        deleteComment={removeComment}
                        deletePost={removePost} 
                        editPost={updatePost}
                        socketAddComment={socketAddComment}
                        socket={socket}
                        />
          <RelatedPosts relatedPosts={relatedPosts} />
        </div>
      )
    } 
  }
}

const mapStateToProps = (state) => {
  return {
    singlePost: state.singlePost,
    relatedPosts: state.relatedPosts,
    loading: state.isFetching,
    authenticated: state.auth.authenticated
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadPost(id) {
          dispatch(fetchSinglePost(id));
        },

        removePost(postId){
          dispatch(deletePost(postId));
        },

        updatePost(newPost){
          dispatch(editPost(newPost));
        },

        removeComment(commentId) {
          dispatch(deleteComment(commentId));
        },

        socketAddComment(comments) {
          dispatch({type: 'SOCKET_ADD_COMMENT', payload:comments});
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExtendedPostPage);