import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { posts }  from '../post/reducers/posts';
import { singlePost }  from '../post/reducers/singlePost';
import { relatedPosts }  from '../post/reducers/relatedPosts';
import notifications from '../notification/reducers/notifications';
import { filter } from '../filter/reducers/filter';
import { errors } from '../widgets/reducers/errors';
import { loading } from '../widgets/reducers/loading';
import user from '../user/reducers/user';
import auth from '../authentication/reducers/auth';

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
