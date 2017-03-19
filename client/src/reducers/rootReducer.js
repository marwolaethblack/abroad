import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { posts }  from './posts';
import { errors } from './errors';


const rootReducer = combineReducers({
    posts,
    errors,
    router: routerReducer
});

export default rootReducer;