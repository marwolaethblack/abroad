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
                <label htmlFor="country_from">From</label>
                <FilterDropdown
                 options={countries}
                 name="country_from" 
                 defaultValue={query.country_from} 
                 optionChanged={this.props.filterUpdate} />
            </div>

            <div>
                <label htmlFor="country_in">In</label>
                <FilterDropdown
                 options={countries}
                 name="country_in" 
                 defaultValue={query.country_in}
                 optionChanged={this.props.filterUpdate} />
            </div>

            <div>
                <label htmlFor="category">Category</label>        
                 <FilterDropdown
                 options={categories}
                 name="category" 
                 defaultValue="All"
                 optionChanged={this.props.filterUpdate} />
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
        category: PropTypes.array.isRequired
    }).isRequired
}

export default SimplePostFilter;