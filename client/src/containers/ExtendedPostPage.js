import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost } from '../actions';
import ExtendedPost from '../components/ExtendedPost';



class ExtendedPostPage extends Component {

  componentDidMount() {
      this.props.loadPost({id: this.props.params.id});
  }
  
  render() {
    const { singlePost, isFetching } = this.props;
    console.log(singlePost);
    return ( 
       <h1>aa</h1>
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