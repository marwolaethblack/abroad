import { ActionTypes } from '../constants';

export const posts = (state=[],action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_POST: {
            return action.post;
        }
        default:
            return state;
    }
}