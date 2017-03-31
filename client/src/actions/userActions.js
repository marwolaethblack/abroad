import { ActionTypes } from '../constants';
import axios from 'axios';

export function fetchUser(id) {
	return function(dispatch) {

		axios.get('/api/user', {params: { id } })
			.then(response => {
				dispatch({type: ActionTypes.FETCH_USER, payload: response.data});
			})
			.catch(err => {
				dispatch({type: ActionTypes.FETCH_USER_ERROR, error: err.response.data.error});
			});
	}

	
}