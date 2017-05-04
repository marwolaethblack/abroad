import React, { Component, PropTypes } from 'react';
import Post from './Post';
import InfiniteScroll from 'redux-infinite-scroll';

class UsersPosts extends Component {

  constructor(props){
    super(props);
    this.handlePostsLoadOnScroll = this.handlePostsLoadOnScroll.bind(this);
    this.state = {
      loadedPosts:[],
      allPostsAreLoaded:false
    }
  }

//how many posts are loaded per one load in the infinite scroller
  postsPerLoad = 2;

  arraysAreEqual = (arr1, arr2) => 
    arr1.length == arr2.length && arr1.every((element, index) => element === arr2[index] );

  componentDidUpdate(prevProps){
    if(!this.arraysAreEqual(prevProps.usersPosts,this.props.usersPosts)) {
      this.setState((prevState)=>({loadedPosts:[...prevState.loadedPosts,...this.props.usersPosts]}));
      if(this.props.postsIds.length == this.state.loadedPosts.length){
        this.setState({allPostsAreLoaded: true});
      } 
    }
  }

  handlePostsLoadOnScroll(){

    if(!this.state.allPostsAreLoaded && !this.props.isFetching.users){
      const { loadedPosts } = this.state;
  
      const nextPostsIds = this.props.postsIds.
        sort((a,b)=>{
          if(a>b) return -1;
          if(a<b) return 1;
          return 0;
        }).
        slice(loadedPosts.length, loadedPosts.length+this.postsPerLoad);

      this.props.loadUsersPosts(nextPostsIds);
    }
  }
  
  render() {
    const { posts,isFetching } = this.props;
    const { loadedPosts, allPostsAreLoaded } = this.state;

    if(this.props.postsIds.length === 0) 
      return <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>

    return (
     <div className="users-posts container" style={{height:"100%"}}>
        <h3>MY POSTS</h3>
        <InfiniteScroll
          loadingMore={isFetching.posts}
          elementIsScrollable={false}
          loadMore={this.handlePostsLoadOnScroll}
          threshold={100} >
          
           {this.state.loadedPosts.map((post,index) => <Post key={post._id} {...post} />)}
          
        </InfiniteScroll>

     </div>
    )
  }
}

export default UsersPosts;

UsersPosts.propTypes = {
  posts: PropTypes.array
}