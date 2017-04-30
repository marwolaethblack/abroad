import { ActionTypes } from '../constants';

export const loading = (state=false, action) => {
    const AT = ActionTypes;
    switch (action.type) {
        case AT.FETCH_POSTS:
        case AT.FETCH_SINGLE_POST:
        case AT.ADDING_POST:
        case AT.EDITING_POST:
        case AT.DELETING_POST: {
            return {...state, posts: true};
        }
        case AT.FETCH_SINGLE_POST_DONE:
        case AT.FETCH_POSTS_DONE:
        case AT.POST_ADDED:
        case AT.POST_EDITED:
        case AT.POST_DELETED:
        case AT.RECEIVED_POSTS_BY_IDS:
        case AT.EDIT_POST_ERROR:
        case AT.ADD_POST_ERROR: {
            return {...state, posts: false};
        }
        case AT.FETCH_USER:{
            return {...state, users: true}
        }
        case AT.RECEIVED_USER:
        case AT.FETCH_USER_ERROR: {
            return {...state,users: false}
        }
        default:
            return state;
    }
}