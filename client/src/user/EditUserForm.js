import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import countries from '../constants/countries';

const isInputEmpty = (value) => {
	if(!value) {
	  return true;
	} 
	return false;
}

const validate = (values) => {
const errors = {};
	
	Object.keys(values).map(key => {
		if(isInputEmpty(values[key])){
			return errors[key]= "required field";
		}	
	});

  return errors;
};


class EditUserForm extends Component {

	constructor(){
		super();
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormSubmit = (editedFields) => {
		this.props.editUser({editedFields, userId:this.props.userInfo._id});
	}

	render(){

		const { handleSubmit, submitting, pristine} = this.props;

		return(
			<form onSubmit={handleSubmit(this.handleFormSubmit)}>
				<div>
					<h2>Edit your profile</h2>
					<div>
						<label htmlFor="country_from">I'm from: </label>
						<Field name="country_from" component="select">
						<option key="-1" value="">Choose a country you're from</option>
							{ Object.values(countries).map((country,i) => <option key={i} value={country}>{country}</option> ) }
						</Field>

						<label htmlFor="country_in">I currently live in: </label>
						<Field name="country_in" component="select">
						<option key="-1" value="">Choose a country you live in</option>
							{ Object.values(countries).map((country,i) => <option key={i} value={country}>{country}</option> ) }
						</Field>
					</div>
				</div>
					{this.props.errorMessage}
				<button disabled={submitting || pristine} type="submit" >Edit</button>
			</form>
		);		
	}

};


EditUserForm = reduxForm({
  form: 'editUser', // a unique identifier for this form
  validate
})(EditUserForm);

EditUserForm = connect(
  state => ({
    initialValues: state.user.userData
  }),
)(EditUserForm)

export default EditUserForm;