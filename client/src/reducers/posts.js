import { ActionTypes } from '../constants';

export const posts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POSTS: {
            return action.posts;
        }
        case ActionTypes.RECEIVED_USERS_POSTS: {
            return action.posts;
        }
        case ActionTypes.POST_ADDED: {
            return [...state, action.newPost];
        }
        default:
            return state;
    }
}