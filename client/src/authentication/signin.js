import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signinUser, socialAuth } from './actions/authentication';



class Signin extends Component {

	//Redirect a user to the main page
	//if he's already authenticated
	static contextTypes = {
		router: React.PropTypes.object
	}

	componentWillMount() {
		if(this.props.authenticated) {
				this.context.router.push('/');
			}
		}

	componentWillUpdate(nextProps) {
		if(nextProps.authenticated) {
			this.context.router.push('/');
		}
	}


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
			<div>
			
				<form onSubmit={handleSubmit(this.handleFormSubmit)} className="main-page-content offset-by-four four columns sign-form">
					<h1>Sign in</h1>
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
				<button onClick={()=>this.props.socialSignin('facebook')}>FB LOGIN</button>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		errorMessage: state.auth.error,
		authenticated: state.auth.authenticated
	};
}

function mapDispatchToProps(dispatch) {
	return {
		signin(data) {
			dispatch(signinUser(data));
		},
		socialSignin(provider) {
			dispatch(socialAuth(provider));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'signin',
})(Signin));
