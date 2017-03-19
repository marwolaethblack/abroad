import { ActionTypes } from '../constants';

export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            return action.singlePost;
        }
        default:
            return state;
    }
}