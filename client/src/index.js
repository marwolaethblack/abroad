import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './containers/App';
import FrontPage from './containers/FrontPage';
import PostsPage from './containers/PostsPage';
import ExtendedPostPage from './containers/ExtendedPostPage';

ReactDOM.render(
  <Provider store={store()}>
  	<Router history={browserHistory}>
  		<Route path="/" component={App}>
  		<IndexRoute component={FrontPage} />
  			<Route path="/posts" component={PostsPage} />
  		  <Route path="/posts/view/:id/:title" component={PostsPage} />
  		</Route>
  	</Router>
  </Provider>,
  document.getElementById('react-container')
);
