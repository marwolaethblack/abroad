import { ActionTypes } from '../constants';

export const relatedPosts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_RELATED_POSTS: {
            return action.posts;
        }
        default:
            return state;
    }
}