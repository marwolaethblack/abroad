import { ActionTypes } from '../../constants/actionTypes';

export default function(state={ latest:[], onPage:[] }, action) {
	switch(action.type) {
		case ActionTypes.GET_LATEST_NOTIFICATIONS:
		 	return {...state, latest: action.notifications};
		case ActionTypes.GET_NOTIFICATIONS:
		 	return {...state, onPage: action.notifications, pages: action.pages};
		case ActionTypes.NOTIFICATIONS_UPDATE:
			return {...state, latest: [...state.latest, action.notification]};
		case ActionTypes.NOTIFICATIONS_SEEN: {
			return {...state, latest: action.seenNotifications};
		}


	}
	return state;
}