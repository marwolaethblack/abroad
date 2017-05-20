import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';


export function getNotificationsOnPage(userId, page=1, limit=15) {
	return function(dispatch) {

		dispatch({type: ActionTypes.GET_NOTIFICATIONS_START});

		return axios.get('/api/notifications-paginate', {params: {id: userId, page, limit},
		 headers: {authorization: localStorage.getItem('token')} })
			.then(resp => {
				dispatch({type: ActionTypes.GET_NOTIFICATIONS, notifications: resp.data.docs, pages: resp.data.pages});
				dispatch({type: ActionTypes.RECEIVED_NOTIFICATIONS});
			})
			.catch(err => {
				dispatch({type: ActionTypes.GET_NOTIFICATIONS_ERROR, message: err.message});
			});
	}
}

export function getLatestNotifications(userId, limit=5) {
	return function(dispatch) {
		return axios.get('/api/notifications-latest', {params: {id: userId, limit},
		 headers: {authorization: localStorage.getItem('token')} })
			.then(resp => {
				dispatch({type: ActionTypes.GET_LATEST_NOTIFICATIONS, notifications: resp.data});
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

