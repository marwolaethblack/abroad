import { ActionTypes } from '../constants';

import layerComments from '../services/layerComments';


export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            const layeredComments = layerComments(action.singlePost.comments);
            return {...state, ...action.singlePost }
        }
        case ActionTypes.COMMENT_ADDED: {
            const layeredComments = layerComments(action.updatedComments);
            return {...state, comments: layeredComments};
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