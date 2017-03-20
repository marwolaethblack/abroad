import React, { Component } from 'react';
import categories from '../../constants/categories';


class CheckboxGroupCategories extends Component {

	constructor(){
		super();
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
	}

	handleCategoryChange(e){
		const checkBox = e.target;
		const { checkedOptions } = this.props;
		let newCategories = [];

		if(checkBox.checked){
			newCategories = (checkBox.value === "All") ? ["All"] : [...checkedOptions,checkBox.value];
		}else{
			const i = this.props.checkedOptions.indexOf(checkBox.value);
			newCategories = checkedOptions.filter((option) => {
				return option !== "All" && option !== checkedOptions[i];
			});
		}

		this.props.onCategoryChange("category",newCategories);
	}

    render() {
    	const { checkedOptions } = this.props;
        return(
        	<div>
				{categories.map((category, index) =>
			       <div key={index}>
			       	 <label htmlFor={category}>{category}</label>
			         <input
			          name={category}
			          type="checkbox"
			          value={category}
			          checked={checkedOptions.indexOf(category) > -1 || checkedOptions.indexOf("All") > -1 }
			          onChange={this.handleCategoryChange} />
			      </div>
				)}
			</div>

        );
    }
}

export default CheckboxGroupCategories;