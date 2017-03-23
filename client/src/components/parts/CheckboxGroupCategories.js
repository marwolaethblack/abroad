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
			newCategories = (checkBox.value === "All") ?
							 categories : 
							 [...checkedOptions,checkBox.value];
			//check "All" checkbox if all other options are checked
			//-2 because the current checked option is not in state yet
			if(checkedOptions.length === categories.length-2){
				newCategories = [...newCategories,"All"];
			}
			console.log("Fuck");
			console.log("checkedOptions: "+checkedOptions.length);
			console.log("categories: "+categories.length);
		} else{
			if(checkBox.value !== "All"){
				newCategories = checkedOptions.filter((option) => {
					return option !== checkBox.value && option !== "All";
				});
			}
		}

		this.props.onCategoryChange("category",newCategories);
	}

    render() {
    	const { checkedOptions } = this.props;
        return(
        	<div className="container">
				{categories.map((category, index) =>
			       <div key={index} className="one column" style={{marginLeft:"7em"}} >
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