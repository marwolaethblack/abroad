import axios from 'axios';
import { browserHistory } from 'react-router';
import { ActionTypes } from '../constants';



export function signinUser({ email, password }) {
	return function(dispatch) {
	//Submit email pasword to server
	axios.post("/api/signin", {email, password})
		.then(response =>{
			//If request is good...
			// - Update state to indicate user is authenticated
			dispatch({type: ActionTypes.AUTH_USER, id: response.data.id, username: response.data.username})
			//- Save the JWT token and user ID
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('id', response.data.id);
			// redirect to route /feature
			browserHistory.goBack();

		})
		.catch((err) => {
			//If request is bad...
			//- show and error to user
			dispatch(authError("Wrong email/password"));
		})

	}
	
}

export function authError(error) {
	return {
		type: ActionTypes.AUTH_ERROR,
		payload: error
	}
}

export function signoutUser(notifSocket) {
	localStorage.removeItem("token");
	localStorage.removeItem("id");
	localStorage.removeItem('username');
	notifSocket.close();

	return {
		type: ActionTypes.UNAUTH_USER,
	}
}

export function signUpUser({ email, password, username }) {
	return function(dispatch) {
		axios.post("/api/signup", {email, password, username})
			.then(response => {
				dispatch({type: ActionTypes.AUTH_USER, id: response.data.id, username: response.data.username});
				//Save token and user ID to local storage
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('id', response.data.id);
				localStorage.setItem('username', response.data.username);
				//Redirect back
				browserHistory.push('/posts');
			})
			.catch(error => {
				dispatch(authError(error.response.data.error));
			})
	}
	
}

export function fetchMessage() {
	return function(dispatch) {
		axios.get("/", {
			headers: {authorization: localStorage.getItem('token')}
		})
			.then(response => {
				console.log(response);
			});
	}
}