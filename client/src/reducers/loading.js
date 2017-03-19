import { ActionTypes } from '../constants';

export const loading = (state=false,action) => {
    switch (action.type) {
        case ActionTypes.FETCH_POSTS: {
            return true;
        }
        case ActionTypes.FETCH_SINGLE_POST: {
            return true;
        }
        case ActionTypes.FETCH_SINGLE_POST_DONE: {
            return false;
        }
        default:
            return state;
    }
}