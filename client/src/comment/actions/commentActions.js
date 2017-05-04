import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';


export const addComment = (postId, comment, parentId) => (dispatch) => {

    dispatch({type:ActionTypes.ADDING_COMMENT});

    axios.put('/api/addComment',
              {postId, comment, parentId},
              {headers: {authorization: localStorage.getItem('token')}
        })
        .then(resp => {
            dispatch({
                type: ActionTypes.COMMENT_ADDED,
                updatedComments: resp.data.comments
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.ADD_COMMENT_ERROR,
                message: err.response.data.error
            });
        });
}

//commentInfo => { editedComment, commentId, authorId }
export const editComment = (commentInfo) => (dispatch) =>{

    dispatch({type:ActionTypes.EDITING_COMMENT});

    axios.put('/api/editComment', { commentInfo }, 
                {headers: {authorization: localStorage.getItem('token')} })
        .then(resp => {

            //all post's comments are returned in response 
            //so they can be layered in the reducer
            dispatch({
                type: ActionTypes.COMMENT_EDITED,
                updatedComments: resp.data
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.EDIT_COMMENT_ERROR,
                message: err.response.data.error
            });
        });
}

export const deleteComment = (commentId) => (dispatch) => {

    dispatch({type: ActionTypes.DELETING_COMMENT});
    axios.delete('/api/deleteComment',   
                    { params: { commentId },
                      headers: {authorization: localStorage.getItem('token')}
                }
        )
        .then(resp => {
            dispatch({type: ActionTypes.COMMENT_DELETED, updatedComments: resp.data});
        })
        .catch(err => {
            console.log(err);
        })
}