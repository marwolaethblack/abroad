import React, { Component } from 'react';
import { Link } from 'react-router';

import countries from '../constants/countries';
import FilterDropdown from './parts/FilterDropdown';
import CheckboxGroupCategories from './parts/CheckboxGroupCategories';


class SearchFilter extends Component {

    render() {
    	const { country_from, country_in, category } = this.props.query;
        return(
        	<div>
	        	<h1>SearchFilter Component</h1>

	        	 <FilterDropdown
		          options={countries}
		          name="country_from" 
		          defaultValue={country_from} 
		          optionChanged={this.props.filterUpdate} />
	 
		        <FilterDropdown
		          options={countries}
		          name="country_in" 
		          defaultValue={country_in} 
		          optionChanged={this.props.filterUpdate} />

		          <CheckboxGroupCategories
		           checkedOptions={category}
		           onCategoryChange={this.props.filterUpdate} />

		          <Link to={{pathname:"/posts", query:this.props.query}}>
		          	<button>FILTER!</button>
		          </Link>
	          </div>
        );
    }
}

export default SearchFilter;