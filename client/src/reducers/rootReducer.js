import { combineReducers } from 'redux';
import { posts }  from './posts';
import { filter } from './filter';
import { errors } from './errors';
import { loading } from './loading';

const testReducer = (state = "defaultStateValue",action) => {
    if(action.type === "TEST"){
        console.log("Action 'TEST' was dispatched.");
        return "test works?"
    }
    return state;
}

const rootReducer = combineReducers({
    posts,
    filter,
    errors,
    isFetching: loading,
    test: testReducer
});

export default rootReducer;
