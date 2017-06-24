import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { trimFormValues,createFileFormData } from '../../services/formHandling';

export function fetchUser(id) {
	return function(dispatch) {
		 dispatch({ type: ActionTypes.FETCH_USER });

		return axios.get('/api/user', { params: { id } })
			.then(resp => {
				dispatch({type: ActionTypes.RECEIVED_USER, payload: resp.data});
			})
			.catch(err => {
				dispatch({type: ActionTypes.FETCH_USER_ERROR, error: err.message});
			});
	}
}


export function editUser(userInfo) {
	return function(dispatch) {
		 dispatch({ type: ActionTypes.EDITING_USER });

		//trim values of form fields
	    userInfo = trimFormValues(userInfo);

	    //assign form fields into FormData to send the form as multipart/form-data
	    let body = createFileFormData(userInfo);

		return axios.put('/api/editUser', body, 
					{headers: {authorization: localStorage.getItem('token')} })
			.then(resp => {
				browserHistory.push('/my-profile');
			})
			.catch(err => {
				dispatch({type: ActionTypes.EDIT_USER_ERROR, message: err.message});
			});
	}
}




export function addNotificationSubscription(subscription) {
	return function(dispatch) {
		
	 axios.put('/api/notifications/addSubscription', subscription, {headers: {authorization: localStorage.getItem('token')} })
						.then(resp => {
							console.log(resp.data);
							dispatch({type: ActionTypes.SUBSCRIPTION_ADDED, subscription: resp.data})
						})
						.catch(err => {
							dispatch({
				                type: ActionTypes.ADD_SUBSCRIPTION_ERROR,
				                message: err.response.data.error
				            });
						})
	}

}


export function deleteNotificationSubscription(index) {
	return function(dispatch) {
		console.log(index);
	 axios.delete('/api/notifications/deleteSubscription', { params: { index } , headers: {authorization: localStorage.getItem('token')}
	 													     })
						.then(resp => {
							dispatch({type: ActionTypes.SUBSCRIPTION_REMOVED, subscriptions: resp.data})
						})
						.catch(err => {
							dispatch({
				                type: ActionTypes.REMOVE_SUBSCRIPTION_ERROR,
				                message: err.response.data.error
				            });
						})
	}

}



