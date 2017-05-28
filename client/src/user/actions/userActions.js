import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { trimFormValues,createFileFormData } from '../../services/formHandling';

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

