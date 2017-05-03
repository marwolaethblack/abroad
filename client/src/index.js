import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';


import store from './store/store';
import App from './containers/App';
import FrontPage from './containers/FrontPage';
import PostsPage from './containers/PostsPage';
import ExtendedPostPage from './containers/ExtendedPostPage';
import UserPageContainer from './containers/UserPageContainer';
import EditUserProfile from './containers/EditUserProfile';
import NewPostPage from './containers/NewPostPage';

import Signin from './containers/auth/signin';
import Signup from './containers/auth/signup';

//Higher order component used to wrap components
//of protected routes
import RequireAuth from './containers/auth/requireAuth'; 
        

import { ActionTypes } from './constants';

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
  		  <Route path="posts/view/:id/:title" component={ExtendedPostPage} />
        <Route path="add-post" component={NewPostPage} />
        <Route path="user/:id" component={UserPageContainer} />
        <Route path="user/:id/edit-profile" component={EditUserProfile} />
        <Route path="signin" component={Signin} />
        <Route path="signup" component={Signup} />
  		</Route>
  	</Router>
  </Provider>,
  document.getElementById('react-container')
);
