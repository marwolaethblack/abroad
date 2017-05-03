import { ActionTypes } from '../constants';
import axios from 'axios';
import { browserHistory } from 'react-router';




export function fetchUser(id) {
	return function(dispatch) {
		 dispatch({ type: ActionTypes.FETCH_USER });

		return axios.get('/api/user', {params: { id } })
			.then(response => {
				dispatch({type: ActionTypes.RECEIVED_USER, payload: response.data});
			})
			.catch(err => {
				dispatch({type: ActionTypes.FETCH_USER_ERROR, error: err.message});
			});
	}
}

//userInfo = { editedFields, userId }
export function editUser(userInfo) {
	return function(dispatch) {
		 dispatch({ type: ActionTypes.EDITING_USER });

		return axios.put('/api/editUser', {userInfo}, 
					{headers: {authorization: localStorage.getItem('token')} })
			.then(resp => {
				browserHistory.push(`/user/${resp.data._id}`);
			})
			.catch(err => {
				dispatch({type: ActionTypes.EDIT_USER_ERROR, message: err.message});
			});
	}
}


export function getNotifications(id) {
	return function(dispatch) {
		return axios.get('/api/user/notifications', {params: {id} })
			.then(resp => {
				dispatch({type: ActionTypes.GET_NOTIFICATIONS, notifications: resp.data});
			})
			.catch(err => {
				dispatch({type: ActionTypes.GET_NOTIFICATIONS_ERROR, message: err.message});
			});
	}
}

export function socketNotificationsUpdate(notification) {
	return function(dispatch) {
		dispatch({type:ActionTypes.NOTIFICATIONS_UPDATE, notification});
	}
}
