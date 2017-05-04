import { ActionTypes } from '../constants';

export const posts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POSTS: {
            return action.posts;
        }
        case ActionTypes.RECEIVED_POSTS_BY_IDS: {
            return action.posts;
        }
        case ActionTypes.POST_ADDED: {
            return [...state, action.newPost];
        }
        default:
            return state;
    }
}