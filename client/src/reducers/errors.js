import { ActionTypes } from '../constants';

export const errors = (state="",action) => {
    switch (action.type) {
        case ActionTypes.FETCH_POSTS_ERROR:
            return action.message;
        case ActionTypes.ADD_COMMENT_ERROR:
        	return action.message;
        case "@@redux-form/DESTROY": //when navigating away from the form  clear errors
			return "";
        default:
            return state;
    }
}

