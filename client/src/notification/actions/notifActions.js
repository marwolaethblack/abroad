import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';


export function getNotifications(userId) {
	return function(dispatch) {
		return axios.get('/api/user/notifications', {params: {id: userId},
		 headers: {authorization: localStorage.getItem('token')} })
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

export function notificationsWereSeen(notifications, userId) {
	return function(dispatch) {



		let seenNotifications = notifications.map(notif => {
				notif.seen = true;
				return notif;
		});

		//change notifications' property 'seen' only in the app state
		dispatch({type:ActionTypes.NOTIFICATIONS_SEEN, seenNotifications});

		//then change the notifications in DB
		 axios.put('/api/notifications/seen',
              {userId: userId},
              {headers: {authorization: localStorage.getItem('token')}
        });
	}
}

