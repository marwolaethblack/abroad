import { ActionTypes } from '../../constants/actionTypes';

export const posts = (state={data:[], pages:0},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POSTS: {
            return {
                ...state, 
                data: action.posts
            };
        }
        // ???????????????????????????????????????????????
        case ActionTypes.RECEIVED_POSTS_BY_IDS: {
            return {
                data: action.posts,
                pages: action.pages
            };
        }
        case ActionTypes.RECEIVED_POSTS_BY_USER: {
            return {
                data: action.posts, 
                pages: action.pages
            };
        }
        case ActionTypes.POST_ADDED: {
            return {
                ...state, 
                data: [...state.data, action.newPost]
            };
        }
        default:
            return state;
    }
}