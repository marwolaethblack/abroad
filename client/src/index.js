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
import MyProfileContainer from './user/containers/MyProfileContainer';
import EditUserProfile from './user/containers/EditUserProfile';
import NewPostPage from './post/containers/NewPostPage';
import Notifications from './notification/containers/Notifications';
import EditSubscriptions from './user/EditSubscriptions';
import NotFoundPage from './app/NotFoundPage';


import Signin from './authentication/signin';
import Signup from './authentication/signup';

//Higher order component used to wrap components
//of protected routes
import RequireAuth from './authentication/requireAuth'; 
        

import { ActionTypes } from './constants/actionTypes';

const token = localStorage.getItem("token");
const id = localStorage.getItem('id');
const username = localStorage.getItem('username');
const subscriptions = JSON.parse(localStorage.getItem('subscriptions'));
if(token) {
  store.dispatch({type: ActionTypes.AUTH_USER, id, username, subscriptions});
}

ReactDOM.render(
  <Provider store={store}>
  	<Router history={browserHistory}>
  		<Route path="/" component={App}>
  		  <IndexRoute component={FrontPage} />
  			<Route path="posts" component={PostsPage} />
  		  <Route path="posts/:id(/:country_in)(/:category)(/:title)" component={ExtendedPostPage} />
        <Route path="add-post" component={RequireAuth(NewPostPage)} />
        <Route path="user/:id(/:username)" component={UserPageContainer} />
        <Route path="my-profile" component={RequireAuth(MyProfileContainer)} />
        <Route path="my-profile/edit" component={RequireAuth(EditUserProfile)} />
         <Route path="my-profile/subscriptions" component={RequireAuth(EditSubscriptions)} />
        <Route path="notifications" component={RequireAuth(Notifications)} />
        <Route path="signin" component={Signin} />
        <Route path="signup" component={Signup} />
        <Route path="*" component={NotFoundPage} />
  		</Route>
  	</Router>
  </Provider>,
  document.getElementById('react-container')
);
