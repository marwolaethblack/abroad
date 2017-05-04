import React, { Component } from 'react';
import categories from '../constants/categories';


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
			newCategories = (checkBox.value === "All") ?
							 categories : 
							 [...checkedOptions,checkBox.value];
			//check "All" checkbox if all other options are checked
			//-2 because the current checked option is not in state yet
			if(checkedOptions.length === categories.length-2){
				newCategories = [...newCategories,"All"];
			}
		} else{
			if(checkBox.value !== "All"){
				newCategories = checkedOptions.filter((option) => {
					return option !== checkBox.value && option !== "All";
				});
			}
		}

		this.props.onCategoryChange("category",newCategories);
	}

	toggleSelectVisibility() {
		this.categorySelect.classList.toggle('visible-select'); 
	}


    render() {
    	const { checkedOptions } = this.props;
        return(
        	<div className="allposts-categories">
        		<button onClick={() => this.toggleSelectVisibility()}>Select Categories <i className="fa fa-angle-down" aria-hidden="true"></i>
</button>
        		<div className="category-select" ref={div => this.categorySelect = div}>
				{categories.map((category, index) =>
			       <div key={index} className="category-checkbox">
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
			</div>

        );
    }
}

export default CheckboxGroupCategories;