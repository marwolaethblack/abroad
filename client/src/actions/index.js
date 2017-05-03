import { ActionTypes } from '../constants';
import axios from 'axios';
import { browserHistory } from 'react-router';

export const fetchPosts = filter => dispatch => {
    
    dispatch({ type: ActionTypes.FETCH_POSTS });

    let category = [];
    if(filter.category !== undefined){
        if(filter.category.indexOf("All") === -1){
            category = Array.isArray(filter.category) ? [...filter.category] : filter.category;
        }
    }
    
    axios.get('/api/posts',{params:{...filter,category}})
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_POSTS,
                posts: resp.data
            });
             dispatch({     
                 type: ActionTypes.FETCH_POSTS_DONE        
             });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.FETCH_POSTS_ERROR,
                message: err
            });
        });
};

//Gets posts related to a currently open post
const fetchRelatedPosts = singlePost => dispatch => {
    axios.get('/api/relatedPosts',{params:{...singlePost}})
         .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_RELATED_POSTS,
                posts: resp.data
            });
         })
         .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.FETCH_POSTS_ERROR,
                message: err
            });
         });
};

//Gets a single post
export const fetchSinglePost = id => dispatch => {
    
    dispatch({ type: ActionTypes.FETCH_SINGLE_POST });

    axios.get('/api/singlePost',{params:id })
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_SINGLE_POST,
                singlePost: resp.data
            });
            dispatch({ type: ActionTypes.FETCH_SINGLE_POST_DONE });
            //singlePost is used as a parameter for fetchRelatedPosts
            dispatch(fetchRelatedPosts(resp.data));
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.FETCH_SINGLE_POST_ERROR,
                message: err
            });
        });
};

//Get posts by array of post Ids
export const fetchPostsByIds = Ids => dispatch => {

    dispatch({ type: ActionTypes.FETCH_POSTS });

    axios.get('/api/postsByIds',{params: Ids})
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_POSTS,
                posts: resp.data
            });
            dispatch({
                type: ActionTypes.FETCH_POSTS_DONE
            });
        })
}

export const addPost = (newPost) => (dispatch) =>{

    dispatch({type:ActionTypes.ADDING_POST});

    axios.post('/api/addPost',
              { newPost }, 
              {headers: {authorization: localStorage.getItem('token')}
        })
        .then(resp => {
            dispatch({
                type: ActionTypes.POST_ADDED,
                newPost: resp.data
            });
           browserHistory.push(`/posts/view/${resp.data._id}/${resp.data.title}`);
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.ADD_POST_ERROR,
                message: err.response.data.error
            });
        });
}

//postInfo = { editedPost, postId, posttAuthorId }
export const editPost = (postInfo) => (dispatch) =>{

    dispatch({type:ActionTypes.EDITING_POST});

    axios.put('/api/editPost', { postInfo }, 
                {headers: {authorization: localStorage.getItem('token')} })
        .then(resp => {

            //resp is the edited post from the server
            dispatch({
                type: ActionTypes.RECEIVED_SINGLE_POST,
                singlePost: resp.data
            });

            dispatch({
                type: ActionTypes.POST_EDITED,
                editedPost: resp.data
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.EDIT_POST_ERROR,
                message: err.response.data.error
            });
        });
}

export const deletePost = (postId) => (dispatch) => {
    dispatch({type: ActionTypes.DELETING_POST});
    axios.delete('/api/deletePost',   
                    { params: { postId },
                      headers: {authorization: localStorage.getItem('token')}
                }
        )
        .then(resp => {
            dispatch({type: ActionTypes.POST_DELETED , postId: resp.data});
            browserHistory.goBack();
        })
        .catch(err => {
            console.log(err);
        })
}

export const filterUpdate = (name,value) => {
    if(name === "category" && !Array.isArray(value)){
        value = [value];
    }
    return {
        type: ActionTypes.FILTER_UPDATE,
        name,
        value
    }
};

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

//commentInfo = { editedComment, commentId, authorId }
export const editComment = (commentInfo) => (dispatch) =>{

    dispatch({type:ActionTypes.EDITING_COMMENT});

    axios.put('/api/editComment', { commentInfo }, 
                {headers: {authorization: localStorage.getItem('token')} })
        .then(resp => {

            dispatch({
                type: ActionTypes.COMMENT_EDITED,
                editedComment: resp.data
            });

            //load the post with the edited comment
            dispatch(fetchSinglePost({id:commentInfo.postId}));
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
            dispatch({type: ActionTypes.COMMENT_DELETED , commentId: resp.data});
        })
        .catch(err => {
            console.log(err);
        })
}

export const replyComment = (reply, commentId, postId) => (dispatch) =>{


    axios.put('/api/replyComment', { reply, commentId, postId }, 
                {headers: {authorization: localStorage.getItem('token')} })
        .then(resp => {

            dispatch({
                type: ActionTypes.COMMENT_ADDED,
                repliedPost: resp.data
            });

        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.REPLY_COMMENT_ERROR,
                message: err.response.data.error
            });
        });
}
