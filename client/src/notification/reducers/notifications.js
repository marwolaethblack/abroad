import { ActionTypes } from '../../constants/actionTypes';

export default function(state=[], action) {
	switch(action.type) {
		case ActionTypes.GET_NOTIFICATIONS:
		 	return action.notifications;
		case ActionTypes.NOTIFICATIONS_UPDATE:
			return [...state, action.notification];
		case ActionTypes.NOTIFICATIONS_SEEN: {
			return action.seenNotifications;
		}


	}
	return state;
}