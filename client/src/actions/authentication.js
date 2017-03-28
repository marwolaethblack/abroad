import axios from 'axios';
import { browserHistory } from 'react-router';
import { ActionTypes } from '../constants';



export function signinUser({ email, password }) {
	return function(dispatch) {
	//Submit email pasword to server
	axios.post("/signin", {email, password})
		.then(response =>{
			//If request is good...
			// - Update state to indicate user is authenticated
			dispatch({type: ActionTypes.AUTH_USER})
			//- Save the JWT token
			localStorage.setItem('token', response.data.token);
			// redirect to route /feature
			console.log(browserHistory);
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

export function signoutUser() {
localStorage.removeItem("token");

	return {
		type: ActionTypes.UNAUTH_USER,
	}
}

export function signUpUser({ email, password }) {
	return function(dispatch) {
		axios.post("/signup", {email, password})
			.then(response => {
				dispatch({type: ActionTypes.AUTH_USER});
				localStorage.setItem('token', response.data.token);
				browserHistory.goBack();
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