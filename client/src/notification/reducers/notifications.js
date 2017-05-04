import { ActionTypes } from '../../constants/actionTypes';

export default function(state=[], action) {
	switch(action.type) {
		case ActionTypes.GET_NOTIFICATIONS:
		 	return [...action.notifications ];
		case ActionTypes.NOTIFICATIONS_UPDATE:
			return [...state, action.notification];
	}
	return state;
}