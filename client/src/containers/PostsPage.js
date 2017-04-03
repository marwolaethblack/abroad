import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts, filterUpdate } from '../actions';

import SearchFilter from '../components/SearchFilter';
import SortFilter from '../components/SortFilter';
import AllPosts from '../components/AllPosts';
import { getUserCountryCode }  from '../services/userLocation';
import categories from '../constants/categories'
import countries from '../constants/countries'


class PostsPage extends Component {

  componentWillMount(){
    if(this.props.location.query.country_in === undefined){
        getUserCountryCode().then(countryCode => {
          this.props.updateFilterValue("country_in",countries[countryCode]);      
        });
    }
  }
  
  componentDidMount() {
      const urlQuery = this.props.location.query;
      this.props.loadPosts(urlQuery);
      this.updateStateFilterOnPageLoad(urlQuery);  
  }

  componentDidUpdate(prevProps) {
    // loads new posts when FILTER-btn is clicked and state.filter has been changed
    if(prevProps.location.query !== this.props.location.query){
        this.props.loadPosts(this.props.location.query);
    }
  }

  updateStateFilterOnPageLoad(urlQuery){

    Object.keys(urlQuery).forEach(filterKey => {
        if(filterKey === "category"){
          if(urlQuery.category.indexOf("All") > -1 || urlQuery.category === "All"){
            urlQuery[filterKey] = categories;
          } else {
              if(urlQuery["category"].length === categories.length-1){
                urlQuery["category"] = [...urlQuery["category"],"All"]
              }
          }
        }
      this.props.updateFilterValue(filterKey,urlQuery[filterKey]);
    });
  }
  
  render() {
    const { posts, isFetching,stateQuery,updateFilterValue,loadPosts } = this.props;

    return (
      <section>
          <SearchFilter 
           stateQuery={stateQuery}
           filterUpdate={updateFilterValue} />

          <SortFilter />

              <AllPosts posts={posts}
               loadPosts={this.props.loadPosts} 
               isFetching={isFetching}
               query={stateQuery} 
               urlQuery={this.props.location.query} />

      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  stateQuery: state.filter,
  isFetching: state.isFetching
});

const mapDispatchToProps = (dispatch) => {
    return {
        loadPosts(query) {
          dispatch(fetchPosts(query));
        },
        updateFilterValue(name,value){
          dispatch(filterUpdate(name,value));
        }
    }
}

PostsPage.propTypes = {
   posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    country_from: PropTypes.string.isRequired,
    country_in: PropTypes.string.isRequired,
    upvotes: PropTypes.number.isRequired,
    image: PropTypes.string,
    author: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired

  }))
}



export default connect(mapStateToProps,mapDispatchToProps)(PostsPage);