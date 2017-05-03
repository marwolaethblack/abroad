import { ActionTypes } from '../constants';

import layerComments from '../services/layerComments';


export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            const layeredComments = layerComments(action.singlePost.comments);
            return {...state, ...action.singlePost }
        }
        case ActionTypes.COMMENT_ADDED:
        case ActionTypes.COMMENT_DELETED: {
            const layeredComments = layerComments(action.updatedComments);
            return {...state, comments: layeredComments};
        }
        case 'SOCKET_ADD_COMMENT': {
            const comments = layerComments(action.payload);
            return{...state, comments};
        }
        default:
            return state;
    }
}