import { ActionTypes } from '../constants';

export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            return {...state, ...action.singlePost};
        }
        case ActionTypes.COMMENT_ADDED: {
            return {...state, ...action.updatedPost};
        }
        default:
            return state;
    }
}