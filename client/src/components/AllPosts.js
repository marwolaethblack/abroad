import React, { Component, PropTypes } from 'react';
import Post from '../components/Post';
import InfiniteScroll from 'redux-infinite-scroll';

class AllPosts extends Component {

  constructor(props){
    super(props);
    this.handlePostsLoadOnScroll = this.handlePostsLoadOnScroll.bind(this);
    this.state = {
      loadedPosts:[],
      allPostsAreLoaded:false
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.urlQuery !== this.props.urlQuery){
      this.setState({loadedPosts:[],allPostsAreLoaded:false});
    }

    if(prevProps.posts !== this.props.posts){
      this.setState((prevState)=>({loadedPosts:[...prevState.loadedPosts,...this.props.posts]}));
      if(this.props.posts.length === 0){
        this.setState({allPostsAreLoaded: true});
      } 
    }
  }

  handlePostsLoadOnScroll(){

    if(!this.state.allPostsAreLoaded){
      const { loadedPosts } = this.state;

      let lastPost = {};
      if(loadedPosts.length > 0){
        lastPost = {
          _id: loadedPosts[loadedPosts.length-1]._id,
          upvotes: loadedPosts[loadedPosts.length-1].upvotes
        }
      }

      this.props.loadPosts(
        {...this.props.urlQuery,
         _id:lastPost._id,
         upvotes:lastPost.upvotes,
         loadedPostsNo:loadedPosts.length}
      );
    }
  }
  
  render() {
  	const { posts,isFetching } = this.props;
    if(this.state.loadedPosts.length === 0 && !isFetching) 
      return <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>

    return (
     <div className="posts-page container" style={{height:"100%"}}>

        <InfiniteScroll
          loadingMore={isFetching}
          elementIsScrollable={false}
          loadMore={this.handlePostsLoadOnScroll}
          threshold={100} >
          
           {this.state.loadedPosts.map((post,index) => <Post key={post._id} {...post} />)}
          
        </InfiniteScroll>

     </div>
    )
  }
}

export default AllPosts;

AllPosts.propTypes = {
	posts: PropTypes.array
}