import axios from 'axios';
import { browserHistory } from 'react-router';
import { ActionTypes } from '../../constants/actionTypes';
import { getNotifications } from '../../notification/actions/notifActions';
import { fbPromises } from '../social/fb';


function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
};

export function socialAuth(provider) {
	return function(dispatch) {
		//add FB SDK script 
	    fbPromises.init()
            .then(
                function(){
                	//open fb login window after FB SDK is loaded
                    window.FB.login(function(response) {
                    	//a user successfully logged in
                        if (response.authResponse) {
                        	//get the user's FB info
                         window.FB.api('/me?fields=id,name,email,locale', function(response) {
					        axios.get('/api/socialUser', {params: { ...response, provider } })
								.then(resp => {
									dispatch({type: ActionTypes.AUTH_USER, id: resp.data.id, username: resp.data.username});
									localStorage.setItem('token', resp.data.token);
									localStorage.setItem('id', resp.data.id);
									browserHistory.goBack();
									dispatch(getNotifications(resp.data.id));
								})
								.catch(err => {
									dispatch({type: ActionTypes.FETCH_USER_ERROR, error: err.message});
								});
					        });
				        } else {
				           	console.log('User cancelled login or did not fully authorize.');
				        }
		            }, {scope: 'email,public_profile'});
		        }
        )

	}
}


export function signinUser({ email, password }) {
	return function(dispatch) {
	//Submit email pasword to server
	axios.post("/api/signin", {email, password})
		.then(response =>{
			//If request is good...
			// - Update state to indicate user is authenticated
			dispatch({type: ActionTypes.AUTH_USER, id: response.data.id, username: response.data.username, subscriptions:response.data.subscriptions})
			//- Save the JWT token and user ID
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('id', response.data.id);
			localStorage.setItem('subscriptions', JSON.stringify(response.data.subscriptions));
			// redirect to route /feature
			browserHistory.goBack();
			dispatch(getNotifications(response.data.id));
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
	localStorage.removeItem('subscriptions');
	notifSocket.close();

	//FB log out
    fbPromises.init()
        .then(
            () => {
                fbPromises.checkLoginState().then(resp => {
                	if(resp.status === 'connected'){
                		window.FB.logout();
                	}
                })
            }
    )

	return {
		type: ActionTypes.UNAUTH_USER,
	}
}

export function signUpUser({ email, password, username }) {
	return function(dispatch) {
		axios.post("/api/signup", {email, password, username})
			.then(response => {
				console.log("FUCK response: ");
				console.log(response);
				dispatch({type: ActionTypes.AUTH_USER, id: response.data.id, username: response.data.username});
				//Save token and user ID to local storage
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('id', response.data.id);
				localStorage.setItem('username', response.data.username);
				//Redirect back
				browserHistory.push('/posts');
				dispatch(getNotifications(response.data.id));
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