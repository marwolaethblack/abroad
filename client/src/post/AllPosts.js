import React, { Component, PropTypes } from 'react';
import Post from './Post';
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

  arraysAreEqual = (arr1, arr2) => 
    arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index] );

    componentDidMount(){
      this.props.loadPosts(this.props.urlQuery);
    }

    componentWillUpdate(nextProps){
      //JSON.stringify() can be used in comparison because urlQuery is always a simple object
      //and query properties are in the same order
      if(JSON.stringify(nextProps.urlQuery) !== JSON.stringify(this.props.urlQuery)){
        this.setState({loadedPosts:[],allPostsAreLoaded:false});
      }
    }

  componentDidUpdate(prevProps){
    // if(prevProps.posts !== this.props.posts){
    if(!this.arraysAreEqual(prevProps.posts, this.props.posts)){
      this.setState((prevState)=>({loadedPosts:[...prevState.loadedPosts,...this.props.posts]}));
      if(this.props.posts.length === 0){
        this.setState({allPostsAreLoaded: true});
      } 
    }
  }

  handlePostsLoadOnScroll(){

    if(!this.state.allPostsAreLoaded && !this.props.isFetching.posts){
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
    const { loadedPosts } = this.state;

    if(loadedPosts.length === 0 && !isFetching.posts) 
      return <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>

    return (
     <div className="posts-page container" style={{height:"auto"}}>

        <InfiniteScroll
          loadingMore={isFetching.posts}
          elementIsScrollable={false}
          loadMore={this.handlePostsLoadOnScroll}
          threshold={100} >
          
           {loadedPosts.map((post,index) => <Post key={post._id} {...post} />)}
          
        </InfiniteScroll>

     </div>
    )
  }
}

export default AllPosts;

AllPosts.propTypes = {
	posts: PropTypes.array
}