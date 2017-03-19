import { ActionTypes } from '../constants';
import axios from 'axios';

export const fetchPosts = filter => dispatch => {
    
    dispatch({ type: ActionTypes.FETCH_POSTS });

    axios.get('/api/posts',{params:filter})
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

export const filterUpdate = (name,value) => {
    return {
        type: ActionTypes.FILTER_UPDATE,
        name,
        value
    }
};