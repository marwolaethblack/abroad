import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { posts }  from './posts';
import { singlePost }  from './singlePost';
import { filter } from './filter';
import { errors } from './errors';
import { loading } from './loading';
import auth from './auth';

import { reducer as form } from 'redux-form';


const rootReducer = combineReducers({
    posts,
    singlePost,
    filter,
    errors,
    auth,
    form,
    isFetching: loading,
    router: routerReducer
});

export default rootReducer;
