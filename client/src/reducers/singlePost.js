import { ActionTypes } from '../constants';


export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            return {...state, ...action.singlePost }
        }
        case ActionTypes.COMMENT_ADDED: {
            const comments = action.updatedComments;
            console.log({...state, comments});
            return {...state, comments};
        }
        case ActionTypes.COMMENT_DELETED: {
            const { commentId } = action;
            const index = state.comments.findIndex((element) => {
                return element._id === commentId
            });
            const comments = [...state.comments.slice(0, index), ...state.comments.slice(index + 1)];
            return {...state, comments }
        }
        case 'SOCKET_ADD_COMMENT': {
            const comments = action.payload
            return{...state, comments}
        }
        default:
            return state;
    }
}