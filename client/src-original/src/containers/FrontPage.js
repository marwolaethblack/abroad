import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchPosts } from '../actions/postActions';
import { filterUpdate } from '../actions/filterActions';
import FrontPageTitle from '../components/parts/FrontPageTitle';
import FrontPagePosts from '../components/FrontPagePosts';
import SimplePostFilter from '../components/SimplePostFilter';

import { getUserCountryCode }  from '../services/userLocation';
import countries from '../constants/countries';
import defaultPostsFilter from '../constants/defaultPostsFilter';

class FrontPage extends Component {

  componentWillMount(){
     this.props.updateFilterValue("category",["All"]);  
  }
  
  componentDidMount(){
    if(!this.props.filterQuery.country_in){
      getUserCountryCode().then(countryCode => {
        const countryIn = countries[countryCode];
        this.props.updateFilterValue("country_in",countryIn);
        // posts must be loaded in getUserCountryCode()
        // because it is asynchronous
        this.props.loadPosts({...defaultPostsFilter,country_in:countryIn});
      });
    }

      this.props.loadPosts(this.props.filterQuery);
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

FrontPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    country_from: PropTypes.string.isRequired,
    country_in: PropTypes.string
  }))
}


export default connect(mapStateToProps,mapDispatchToProps)(FrontPage);