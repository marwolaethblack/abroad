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

      let lastPostId = (loadedPosts.length > 0) ? loadedPosts[loadedPosts.length-1]._id : false;
      this.props.loadPosts({...this.props.query, _id:lastPostId});
      // this.props.loadPosts({_id:lastPostId});
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