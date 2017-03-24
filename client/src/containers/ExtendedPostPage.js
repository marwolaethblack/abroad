import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost } from '../actions';
import ExtendedPost from '../components/ExtendedPost';


class ExtendedPostPage extends Component {

  componentWillMount() {
      this.props.loadPost({id: this.props.params.id});
  }
  
  render() {
    const { singlePost, isFetching } = this.props;
    return ( 
     !isFetching && <ExtendedPost {...singlePost} />
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