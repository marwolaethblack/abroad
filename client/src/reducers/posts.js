import { ActionTypes } from '../constants';

export const posts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POSTS: {
        	// if(state.posts.length === 1){

        	// }
        	console.log(state);
            return action.posts;
        }
        default:
            return state;
    }
}