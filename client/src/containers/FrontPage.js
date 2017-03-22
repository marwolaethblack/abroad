import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts,filterUpdate } from '../actions';
import FrontPageTitle from '../components/parts/FrontPageTitle';
import FrontPagePosts from '../components/FrontPagePosts';
import SimplePostFilter from '../components/SimplePostFilter';

class FrontPage extends Component {
  
  componentDidMount(){
    //posts on the front-page will be generated more dynamic later 
    this.props.updateFilterValue("category",["All"]);
    this.props.loadPosts({...this.props.filterQuery,category:["All"]});
  }
  
  render() {
    return (
      <div>
        <FrontPageTitle />
        <SimplePostFilter query={this.props.filterQuery} filterUpdate={this.props.updateFilterValue} />
        <FrontPagePosts posts={this.props.posts} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  filterQuery: state.filter //query used only for default filter
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts(query){
    dispatch(fetchPosts(query));
  },
  updateFilterValue(name,value){
    dispatch(filterUpdate(name,value));
  }
});


export default connect(mapStateToProps,mapDispatchToProps)(FrontPage);