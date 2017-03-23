import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import countries from '../constants/countries';
import categories from '../constants/categories';
import FilterDropdown from './parts/FilterDropdown';

class SimplePostFilter extends Component {

  render() {
    //default query from state
    const { query } = this.props;

    return (
      <div className="container">
        <div className="four columns">
            <label htmlFor="country_from">From</label>
            <FilterDropdown
             options={countries}
             name="country_from" 
             defaultValue={query.country_from} 
             optionChanged={this.props.filterUpdate} />
        </div>

        <div className="four columns">
            <label htmlFor="country_in">In</label>
            <FilterDropdown
             options={countries}
             name="country_in" 
             defaultValue={query.country_in}
             optionChanged={this.props.filterUpdate} />
        </div>

        <div className="four columns">
            <label htmlFor="category">Category</label>        
             <FilterDropdown
             options={categories}
             name="category" 
             defaultValue={query.category[0]}
             optionChanged={this.props.filterUpdate} />
        </div>

        <Link to={{ pathname:'/posts', query }}><button>Find it!</button></Link>
      </div>
    )
  }
}

export default SimplePostFilter;