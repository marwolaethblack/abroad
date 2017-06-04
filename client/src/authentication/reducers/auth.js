import { ActionTypes } from '../../constants/actionTypes';

export default function(state={ subscriptions: [] }, action) {
	switch(action.type) {
		case ActionTypes.AUTH_USER:
			return {...state, error:"", authenticated: true, id: action.id, username: action.username, subscriptions: action.subscriptions };
		case ActionTypes.UNAUTH_USER:
			return {...state, authenticated: false, id:"", username: "", subscriptions: [] };
		case ActionTypes.AUTH_ERROR:
			return {...state, error:action.payload };
		case "@@redux-form/DESTROY": //when navigating away from the signin/signup pages clear errors
			return {...state, error: ""};
		case ActionTypes.SUBSCRIPTION_ADDED: {
			var subscriptions =  [...state.subscriptions, action.subscription];
			localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
			return {...state, subscriptions };
		}
		case ActionTypes.SUBSCRIPTION_REMOVED: {
			var subscriptions = action.subscriptions;
			localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
			return {...state, subscriptions};
		}
			
		 default:
            return state;
    }
}