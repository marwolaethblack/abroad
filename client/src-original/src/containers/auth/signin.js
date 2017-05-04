import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signinUser } from '../../actions/authentication';

class Signin extends Component {

	handleFormSubmit = ({email, password}) => {
		this.props.signin({email, password});
	}	

	renderAlert = () => {
		if(this.props.errorMessage) {
			return (
				<div className="alert">
					<strong>Oops!</strong> {this.props.errorMessage}
				</div>
			);
		}
	}

	render() {
		const { handleSubmit } = this.props;
		return(
			<form onSubmit={handleSubmit(this.handleFormSubmit)}>
				<fieldset className='form-group'>
					<label>Email:</label>
					<Field name="email" component="input" type="email" className="form-control" />
				</fieldset>
				<fieldset className='form-group'>
					<label>Password:</label>
					<Field name="password" component="input" type="password" className="form-control" />
				</fieldset>
				{this.renderAlert()}
				<button action="submit" className="btn btn-primary">Sign In</button>
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {errorMessage: state.auth.error};
}

function mapDispatchToProps(dispatch) {
	return {
		signin(data) {
			dispatch(signinUser(data));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'signin',
})(Signin));
