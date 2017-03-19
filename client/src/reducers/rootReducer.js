import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { posts }  from './posts';
import { singlePost }  from './singlePost';
import { filter } from './filter';
import { errors } from './errors';
import { loading } from './loading';


const rootReducer = combineReducers({
    posts,
    singlePost,
    filter,
    errors,
    isFetching: loading,
    router: routerReducer
});

export default rootReducer;
