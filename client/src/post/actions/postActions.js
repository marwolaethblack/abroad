import { ActionTypes } from '../../constants/actionTypes';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { beautifyUrlSegment, spaceToDash } from '../../services/textFormatting';
import { getUserCountryCode }  from '../../services/userLocation';
import countries from '../../constants/countries'


const getCountryIn = () => {
        return new Promise((resolve, reject) => {
            getUserCountryCode().then(countryCode => {
                if(countries[countryCode]){
                    resolve(countries[countryCode]);
                }
                reject();
            });
        });
}

export const fetchPosts = filter => dispatch => {

    let category = [];
    if(filter.category !== undefined){
        if(filter.category.indexOf("All") === -1){
            category = Array.isArray(filter.category) ? [...filter.category] : filter.category;
        }
    }

    if(!filter.country_from){
        filter.country_from = "Slovakia";
    }

    //actual fetching
    const receivePosts = (filterChange) => {
        axios.get('/api/posts',{params:{...filter, ...filterChange, category }})
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
            dispatch({
                type: ActionTypes.FETCH_POSTS_ERROR,
                message: err
            });
        });
    }
    
    
    dispatch({ type: ActionTypes.FETCH_POSTS });

    if(!filter.country_in){
        getCountryIn().then(country_in => {
            receivePosts({ country_in });
        }).catch(()=>{
            receivePosts({ country_in: 'Denmark' });
        });
    } else {
        receivePosts();
    }  
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
            dispatch({
                type: ActionTypes.FETCH_SINGLE_POST_ERROR,
                message: err
            });
        });
};

//Get posts by array of post Ids
//used to get user's posts for pagination
export const fetchPostsByIds = (Ids, page=1, limit=5) => dispatch => {

    dispatch({ type: ActionTypes.FETCH_POSTS });

    axios.get('/api/postsByIds',{params: {Ids, page, limit}})
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_POSTS_BY_IDS,
                posts: resp.data.docs,
                pages: resp.data.pages
            });

            dispatch({
                type: ActionTypes.FETCH_POSTS_DONE
            });
        })
        .catch(err => {
            dispatch({
                type: ActionTypes.FETCH_POSTS_ERROR,
                message: err
            });
         });
}

export const addPost = (newPost) => (dispatch) =>{

    dispatch({type:ActionTypes.ADDING_POST});

    Object.values(newPost).foreach(postValue => {
        postValue.trim();
    });

    axios.post('/api/addPost',
              { newPost }, 
              {headers: {authorization: localStorage.getItem('token')}
        })
        .then(resp => {
            dispatch({
                type: ActionTypes.POST_ADDED,
                newPost: resp.data
            });

            const { _id, country_in, title, category } = resp.data;
            browserHistory.push(`/posts/${_id}/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`);
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
