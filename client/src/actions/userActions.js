import { ActionTypes } from '../constants';
import axios from 'axios';

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