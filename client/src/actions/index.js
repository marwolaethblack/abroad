import { ActionTypes } from '../constants';
import axios from 'axios';

export const fetchPosts = category => dispatch => {
    
    axios.get('api/posts')
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_POSTS,
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