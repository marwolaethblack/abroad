import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signUpUser } from '../../actions/authentication';

const renderField = (props) => {
	const { input, label, type, meta: { touched, error, warning } } = props;
	return (
	<fieldset>
	    <label>{label}</label>
	    <div>
	      <input {...input} placeholder={label} type={type}/>
	      {touched && (error && <span>{error}</span>)}
	    </div>
  	</fieldset> );
}




const Signup = (props) => {

		const handleFormSubmit = (formProps) =>{
			props.signUp(formProps);
		}

		const { handleSubmit, submitting, invalid } = props;
		return(
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Field 
					name="username" 
					component={renderField} 
					label="Username" type="text"  />
				<Field 
					name="email" 
					component={renderField} 
					label="Email" type="email"  />
				<Field 
					name="password" 
					component={renderField} 
					label="Password" 
					type="password"  />
				<Field 
					name="confirmPassword" 
					component={renderField} 
					label="Confirm Password" 
					type="password"  />
					{props.errorMessage}
				<button disabled={submitting || invalid} type="submit" >Sign Up</button>
			</form>
		);
};

const validate = (formProps) => {
	const errors = {};
	const fields = ["email", "password", "confirmPassword", "username"];
	const { password, confirmPassword, email, username } = formProps;
	const emailRegExp = new RegExp('.+@.+');

	//Check if fields are not empty
	fields.forEach((field) => {
		if(!formProps[field]) {
			errors[field] = "Required";
		}
	});

	//Check if email is valid
	if(email) {
		if(!emailRegExp.test(email)) {
			errors.email = "Invalid email";
		}
	}

	
	if(username) {
		if(username.length < 3 || username.length > 10) {
			errors.username = "Username must be between 3 and 10 characters long";
		}
	}

	
	if(password !== confirmPassword) {
		errors.password = "Passwords must match";
	}
	return errors;
};

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.error
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		signUp(payload) {
		dispatch(signUpUser(payload));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'signup',
	validate
})(Signup));