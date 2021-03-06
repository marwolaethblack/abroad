import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions/postActions';
import { filterUpdate } from '../../filter/actions/filterActions';

import SearchFilter from '../../filter/SearchFilter';
import SortFilter from '../../filter/SortFilter';
import AllPosts from '../../post/AllPosts';
import { getUserCountryCode }  from '../../services/userLocation';
import categories from '../../constants/categories';
import countries from '../../constants/countries';


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
      // this.props.loadPosts(urlQuery);
      this.updateStateFilterOnPageLoad(urlQuery);  
  }

  componentDidUpdate(prevProps) {
    // loads new posts when FILTER-btn is clicked and state.filter has been changed
    //JSON.stringify() can be used for comparism because urlQuery is always a simple object
    //and query properties are in the same order
    const currentUrlQuery = this.props.location.query;
    if(JSON.stringify(prevProps.location.query) !== JSON.stringify(currentUrlQuery)){
        this.props.loadPosts(currentUrlQuery);
        this.updateStateFilterOnPageLoad(currentUrlQuery);
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
    const { posts, isFetching,stateQuery,updateFilterValue,loadPosts, location } = this.props;

    return (
      <section className="main-page-content">
          <SearchFilter
           urlQuery={location.query} 
           stateQuery={stateQuery}
           filterUpdate={updateFilterValue} />

          <SortFilter location={location} />

              <AllPosts posts={posts}
               loadPosts={loadPosts} 
               isFetching={isFetching}
               urlQuery={location.query} />

      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts.data,
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
    comments: PropTypes.array.isRequired

  }))
}



export default connect(mapStateToProps,mapDispatchToProps)(PostsPage);