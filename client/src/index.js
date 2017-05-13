import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './app/App';
import FrontPage from './app/FrontPage';
import PostsPage from './post/containers/PostsPage';
import ExtendedPostPage from './post/containers/ExtendedPostPage';
import UserPageContainer from './user/containers/UserPageContainer';
import EditUserProfile from './user/containers/EditUserProfile';
import NewPostPage from './post/containers/NewPostPage';

import Signin from './authentication/signin';
import Signup from './authentication/signup';

//Higher order component used to wrap components
//of protected routes
import RequireAuth from './authentication/requireAuth'; 
        

import { ActionTypes } from './constants/actionTypes';

const token = localStorage.getItem("token");
const id = localStorage.getItem('id');
const username = localStorage.getItem('username');
if(token) {
  store.dispatch({type: ActionTypes.AUTH_USER, id, username});
}

ReactDOM.render(
  <Provider store={store}>
  	<Router history={browserHistory}>
  		<Route path="/" component={App}>
  		  <IndexRoute component={FrontPage} />
  			<Route path="posts" component={PostsPage} />
  		  <Route path="posts/:id(/:country_in)(/:category)(/:title)" component={ExtendedPostPage} />
        <Route path="add-post" component={RequireAuth(NewPostPage)} />
        <Route path="user/:id" component={UserPageContainer} />
        <Route path="user/:id/edit-profile" component={EditUserProfile} />
        <Route path="signin" component={Signin} />
        <Route path="signup" component={Signup} />
  		</Route>
  	</Router>
  </Provider>,
  document.getElementById('react-container')
);
