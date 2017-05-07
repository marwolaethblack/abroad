import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import countries from '../constants/countries';
import categories from '../constants/categories';
import FilterDropdown from '../widgets/FilterDropdown';

class SimplePostFilter extends Component {

  render() {
    //default query from state
    const { query } = this.props;

    return (
       <div id="front-page-filter" className="container">
         <div className="wrap">
             <div>
                 <label htmlFor="country_from">I am from:</label>
                 <FilterDropdown
                  options={countries}
                  name="country_from"
                  defaultValue={query.country_from}
                  optionChanged={this.props.filterUpdate} 
                  selectBoxClass="full-width"/>        
             </div>     
        
             <div>      
                 <label htmlFor="country_in">I currently live in: </label>     
                 <FilterDropdown        
                  options={countries}
                  name="country_in"         
                  defaultValue={query.country_in}       
                  optionChanged={this.props.filterUpdate} 
                  selectBoxClass="full-width"/>        
             </div>
        
             <div>      
                 <label htmlFor="category">Category</label>             
                  <FilterDropdown       
                  options={categories}      
                  name="category"       
                  defaultValue={Array.isArray(query.category) ? query.category[0] : query.category}        
                  optionChanged={this.props.filterUpdate} 
                  selectBoxClass="full-width"/>        
             </div>     
          </div>
         <Link to={{ pathname:'/posts', query }}><button className="full-width">Find it!</button></Link>
        </div>
      )
  }
}

SimplePostFilter.propTypes = {
    query: PropTypes.shape({
        country_in: PropTypes.string,
        country_from: PropTypes.string.isRequired,
    }).isRequired
}

export default SimplePostFilter;