import React, { Component } from 'react';
import { Link } from 'react-router';

import countries from '../constants/countries';
import FilterDropdown from './parts/FilterDropdown';
import CheckboxGroupCategories from './parts/CheckboxGroupCategories';


class SearchFilter extends Component {

    render() {
    	const query = this.props.stateQuery;
    	const { country_from, country_in, category } = query;
    	const { filterUpdate } = this.props;
        return(
        	<div className="container">
        		<div className="six columns">
	            	<label htmlFor="country_from">From</label>
		        	 <FilterDropdown
			          options={countries}
			          name="country_from" 
			          defaultValue={country_from} 
			          optionChanged={filterUpdate} />
		        </div>
	 
	 			<div className="six columns">
	           		<label htmlFor="country_in">In</label>
			        <FilterDropdown
			          options={countries}
			          name="country_in" 
			          defaultValue={country_in} 
			          optionChanged={filterUpdate} />
		         </div>

		         <div style={{paddingTop:"5em"}}>
		          <CheckboxGroupCategories
		           checkedOptions={category}
		           onCategoryChange={filterUpdate} />
		         </div>

		          <Link to={{pathname:"/posts", query}}>
		          	<button>FILTER!</button>
		          </Link>
	          </div>
        );
    }
}

export default SearchFilter;