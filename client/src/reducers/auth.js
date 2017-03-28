import { ActionTypes } from '../constants';

export default function(state={}, action) {
	switch(action.type) {
		case ActionTypes.AUTH_USER:
			return {...state, error:"", authenticated: true };
		case ActionTypes.UNAUTH_USER:
			return {...state, authenticated: false };
		case ActionTypes.AUTH_ERROR:
			return {...state, error:action.payload };
		case "@@redux-form/DESTROY": //when navigating away from the signin/signup pages clear errors
			return {...state, error: ""};
	}

	return state;
}