import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { posts }  from './posts';
import { singlePost }  from './singlePost';
import { relatedPosts }  from './relatedPosts';
import { filter } from './filter';
import { errors } from './errors';
import { loading } from './loading';
import user from './user';
import notifications from './notifications';
import auth from './auth';

import { reducer as form } from 'redux-form';


const rootReducer = combineReducers({
    posts,
    singlePost,
    relatedPosts,
    filter,
    errors,
    auth,
    user,
    notifications,
    form,
    isFetching: loading,
    router: routerReducer
});

export default rootReducer;
