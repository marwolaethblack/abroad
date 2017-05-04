import React, { Component, PropTypes } from 'react';
import { countries } from '../constants/countries';

class FullPostFilter extends Component {
    
    constructor(props){
        super(props);
        this.filterPropChanged = this.filterPropChanged.bind(this);
    }

    filterPropChanged(e){
        this.props.filterUpdate(e.target.name, e.target.value);
    }

  render() {
    const { query } = this.props;

    return (
      <div>
        <select defaultValue={query.country_from} name="country_from" onChange={this.filterPropChanged}>
            {countries.map((country,index) => 
                <option key={index} value={country}>{country}</option>
            )}
        </select>
        <select defaultValue={query.country_in} name="country_in" onChange={this.filterPropChanged}>
            {countries.map((country,index) => 
                <option key={index} value={country}>{country}</option>
            )}
        </select>
        <select defaultValue={query.category} name="category" onChange={this.filterPropChanged}>
            <option value="work">Work</option>
            <option value="accommodation">Accommodation</option>
            <option value="trade">Trade</option>
            <option value="events">Events</option>
            <option value="transport">Transport</option>
            <option value="groups">Groups</option>
            <option value="Q&A">Q & A</option>
        </select>
        <button>Find it!</button>
      </div>
    )
  }
}

export default FullPostFilter;