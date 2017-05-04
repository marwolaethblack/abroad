import { ActionTypes } from '../../constants/actionTypes';

export default function(state={}, action) {
	switch(action.type) {
		case ActionTypes.RECEIVED_USER:
			return {...state, error:"", userData: action.payload};
		case ActionTypes.FETCH_USER_ERROR:
			return {...state, error: action.error};
	}

	return state;
}