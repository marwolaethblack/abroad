import { ActionTypes } from '../../constants/actionTypes';
import layerComments from '../../services/layerComments';


export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            const layeredComments = layerComments(action.singlePost.comments);
            return {...state, ...action.singlePost }
        }
        case ActionTypes.COMMENT_ADDED:
        case ActionTypes.COMMENT_DELETED: 
        case ActionTypes.COMMENT_EDITED: {
            const layeredComments = layerComments(action.updatedComments);
            return {...state, comments: layeredComments};
        }
        case 'SOCKET_ADD_COMMENT': {
            const comments = layerComments(action.payload);
            return{...state, comments}
        }
        default:
            return state;
    }
}