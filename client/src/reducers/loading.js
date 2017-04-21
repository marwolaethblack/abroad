import { ActionTypes } from '../constants';

export const loading = (state=false, action) => {
    const AT = ActionTypes;
    switch (action.type) {
        case AT.FETCH_POSTS:
        case AT.FETCH_SINGLE_POST:
        case AT.ADDING_POST:
        case AT.FETCH_USER: {
            return true;
        }
        case AT.FETCH_SINGLE_POST_DONE:
        case AT.FETCH_POSTS_DONE:
        case AT.POST_ADDED:
        case AT.ADD_POST_ERROR:
        case AT.RECEIVED_USER:
        case AT.FETCH_USER_ERROR: {
            return false;
        }
        default:
            return state;
    }
}