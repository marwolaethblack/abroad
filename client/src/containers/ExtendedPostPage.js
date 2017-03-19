import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost } from '../actions';
import Post from '../components/Post';



class ExtendedPostPage extends Component {

  
  componentDidMount() {
      this.props.loadPost({id: this.props.params.id});
  }
  
  render() {
    const { singlePost } = this.props;

    return ( 
      <h1>aaa</h1>
     );
  }
}

const mapStateToProps = (state) => {
  return {
    singlePost: state.singlePost,
    isFetching: state.isFetching
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