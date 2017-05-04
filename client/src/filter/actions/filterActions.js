import { ActionTypes } from '../../constants/actionTypes';

export const filterUpdate = (name,value) => {
    return {
        type: ActionTypes.FILTER_UPDATE,
        name,
        value
    }
};