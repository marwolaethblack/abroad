import { ActionTypes } from '../constants';

export const loading = (state=false,action) => {
    switch (action.type) {
        case ActionTypes.FETCH_POSTS: {
            return true;
        }
         case ActionTypes.RECEIVED_POSTS: {
            return false;
        }
        case ActionTypes.FETCH_SINGLE_POST: {
            return true;
        }
        case ActionTypes.RECEIVED_SINGLE_POST: {
            return false;
        }
        case ActionTypes.FETCH_USER: {
            return true;
        }
        case ActionTypes.RECEIVED_USER: {
            return false;
        }
        case ActionTypes.FETCH_USER_ERROR: {
            return false;
        }
        default:
            return state;
    }
}