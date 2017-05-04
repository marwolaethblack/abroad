  import React, { Component, PropTypes } from 'react';

class FilterDropdown extends Component {

	constructor(){
		super();
		this.optionChanged = this.optionChanged.bind(this);
	}

  optionChanged(e){
  	this.props.optionChanged(e.target.name,e.target.value);
  }
    
  render() {
  	const { defaultValue, name, options } = this.props;

    return (
      <select value={defaultValue} name={name} onChange={this.optionChanged}>

        {Object.keys(options).map(k => 
          <option key={k} value={options[k]}>{options[k]}</option>
        )}

      </select>
    )
  }
}

FilterDropdown.propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.any.isRequired
}

export default FilterDropdown;