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
        	<div>
	        	<h1>SearchFilter Component</h1>

	        	 <FilterDropdown
		          options={countries}
		          name="country_from" 
		          defaultValue={country_from} 
		          optionChanged={filterUpdate} />
	 
		        <FilterDropdown
		          options={countries}
		          name="country_in" 
		          defaultValue={country_in} 
		          optionChanged={filterUpdate} />

		          <CheckboxGroupCategories
		           checkedOptions={category}
		           onCategoryChange={filterUpdate} />

		          <Link to={{pathname:"/posts", query}}>
		          	<button>FILTER!</button>
		          </Link>
	          </div>
        );
    }
}

export default SearchFilter;