import { ActionTypes } from '../constants';

export const posts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POSTS: {
            return action.posts;
        }
        default:
            return state;
    }
}