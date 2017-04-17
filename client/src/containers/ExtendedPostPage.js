import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchSinglePost, fetchRelatedPosts, deleteComment } from '../actions';
import RelatedPosts from '../components/RelatedPosts';
import ExtendedPost from '../components/pages/ExtendedPost';
import Loader from '../components/parts/Loader';


class ExtendedPostPage extends Component {

  // buildRelatedPostsQuery = (currentPost)=>{
  //   return {
  //     country_from: currentPost.country_from,
  //     country_in: currentPost.country_in,
  //     // _id: {$ne: currentPost._id}
  //     // sort: "top",
  //   }
  // }

  componentDidMount() {   
      this.props.loadPost({id: this.props.params.id});

      // const relatedPostsQuery = this.buildRelatedPostsQuery(this.props.singlePost);
      this.props.loadRelatedPosts({id: this.props.params.id});
      
  }

  componentDidUpdate(prevProps) {
    if(!this.props.loading && this.props.relatedPosts.length === 0){

    }
    //loads a new post if url changes
    const currentPathname = this.props.location.pathname;

    if(prevProps.location.pathname !== currentPathname){    
       this.props.loadPost({id: this.props.params.id});

      // if(!this.props.loading){
      //    const relatedPostsQuery = this.buildRelatedPostsQuery(this.props.singlePost);
       // console.log("relatedPostsQuery: "+JSON.stringify(relatedPostsQuery));
        this.props.loadRelatedPosts({id: this.props.params.id});
       // }  
    }
  }
  
  render() {

    const { singlePost, relatedPosts, loading, authenticated, removeComment } = this.props;

    const isEmpty = Object.keys(singlePost).length === 0;
    if(loading) {
        return (<Loader />);
    } else {
      if(isEmpty) {
        return (<h1>No post found</h1>)
      }

      return (
        <div>
          <ExtendedPost {...singlePost} authenticated={authenticated} deleteComment={removeComment}/>
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

        loadRelatedPosts(filter){
          dispatch(fetchRelatedPosts(filter))

        removeComment(commentId) {
          dispatch(deleteComment(commentId));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExtendedPostPage);