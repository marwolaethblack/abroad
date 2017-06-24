import { ActionTypes } from '../../constants/actionTypes';
import layerComments from '../../services/layerComments';


export const singlePost = (state={},action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_SINGLE_POST: {
            const layeredComments = layerComments(action.singlePost.comments);
            return {...action.singlePost, comments: layeredComments};
        }
        case ActionTypes.RECEIVED_EDITED_POST: {
            return { ...state, ...action.editedPost };
        }
        case ActionTypes.COMMENT_ADDED: 
        case ActionTypes.COMMENT_EDITED: {
            const layeredComments = layerComments(action.updatedComments);
            return {...state, comments: layeredComments};
        }
        case ActionTypes.COMMENT_DELETED: {
            const layeredComments = layerComments(action.updatedPost.comments);
            return {...action.updatedPost, comments: layeredComments};
        }
        case ActionTypes.MARK_POST_ANSWERED: {
            const layeredComments = layerComments(action.answeredPost.comments);
            return {...action.answeredPost, comments: layeredComments};
        }
        case ActionTypes.REMOVE_POST_ANSWER: {
            const layeredComments = layerComments(action.changedAnswerPost.comments);
            return {...action.changedAnswerPost, comments: layeredComments};
        }
        case 'SOCKET_ADD_COMMENT': {
            const comments = layerComments(action.payload);
            return{...state, comments}
        }
        default:
            return state;
    }
}