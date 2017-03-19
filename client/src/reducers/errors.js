import { ActionTypes } from '../constants';

export const errors = (state="",action) => {
    switch (action.type) {
        case ActionTypes.FETCH_POSTS_ERROR:
            return action.message;
        default:
            return state;
    }
}

