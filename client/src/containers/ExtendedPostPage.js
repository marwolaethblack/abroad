import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSinglePost } from '../actions';



class ExtendedPostPage extends Component {
  
  componentDidMount() {
      this.props.loadPost(this.props.params.id);
  }
  
  render() {
    console.log(this.props.post);
    return (
      <h1>a</h1>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    singlePost: state.singlePost,
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