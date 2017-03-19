import React, { Component } from 'react';
import countries from '../constants/countries';
import categories from '../constants/categories';
import FilterDropdown from './parts/FilterDropdown';

class SearchFilter extends Component {

	constructor(props){
		super(props);
		this.getPosts = this.getPosts.bind(this);
	}

	getPosts(){
		this.props.getPosts(this.props.query);
	}

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
	 
		         <FilterDropdown
		          options={categories}
		          name="category" 
		          defaultValue={category} 
		          optionChanged={this.props.filterUpdate} />

		          <button onClick={this.getPosts}>FILTER!</button>
	          </div>
        );
    }
}

export default SearchFilter;