import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import countries from '../constants/countries';
import categories from '../constants/categories';
import FilterDropdown from './parts/FilterDropdown';

class SimplePostFilter extends Component {

  render() {
    const { query } = this.props;

    return (
      <div>
        <FilterDropdown
         options={countries}
         name="country_from" 
         defaultValue={query.country_from} 
         optionChanged={this.props.filterUpdate} />

        <FilterDropdown
         options={countries}
         name="country_in" 
         defaultValue={query.country_in} 
         optionChanged={this.props.filterUpdate} />

         <FilterDropdown
         options={categories}
         name="category" 
         defaultValue={query.categories} 
         optionChanged={this.props.filterUpdate} />

        <Link to={{ pathname:'/posts', query }}><button>Find it!</button></Link>
      </div>
    )
  }
}

export default SimplePostFilter;