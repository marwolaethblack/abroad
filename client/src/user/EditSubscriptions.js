import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { addNotificationSubscription, deleteNotificationSubscription } from './actions/userActions';
import { Field, reduxForm } from 'redux-form';

import countries from '../constants/countries';
import categories from '../constants/categories';

const EditSubscriptions = (props) => {

		const handleFormSubmit = (formProps) => {
			props.addSubscription(formProps);
		}

		const { handleSubmit, submitting, pristine} = props;
		const { subscriptions } = props;
		return(
			<form className="" onSubmit={handleSubmit(handleFormSubmit)}>
				<div>
					<ol>
						{
							subscriptions ? subscriptions.map((sub,i)=>{
								return (<li key={i}>
											<span>{sub.notifications_country}</span>
											<span> {sub.notifications_category}</span>
											<span onClick={() => {props.removeSubscription(i);}}>X</span>
									   </li>);
							}) : "No subscriptions"
					   }
					</ol>				
				</div>
				<label htmlFor="notifications_country">Choose a country you want notifications from</label>
				<Field name="notifications_country" component="select">
					{ Object.values(countries).map((country,i) => <option key={i} value={country}>{country}</option> ) }
				</Field>

				<label htmlFor="notifications_category">Choose a category you want notifications from</label>
				<Field name="notifications_category" component="select">
					{ Object.values(categories).map((category,i) => <option key={i} value={category}>{category}</option> ) }
				</Field>
				<button disabled={submitting} type="submit" >Add</button>
			</form>
		);
};



const mapStateToProps = (state) => {
	return {
		subscriptions: state.auth.subscriptions,
		errorMessage: state.errors
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addSubscription(subscription) {
			dispatch(addNotificationSubscription(subscription));
		},
		removeSubscription(index) {
			dispatch(deleteNotificationSubscription(index));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'EditSubscriptions',
	initialValues: {
		notifications_country: "Denmark",
		notifications_category: "All"
	}
})(EditSubscriptions));
