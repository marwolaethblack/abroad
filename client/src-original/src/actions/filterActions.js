import { ActionTypes } from '../constants';

export const filterUpdate = (name,value) => {
    // if(name === "category" && !Array.isArray(value)){
    //     value = [value];
    // }
    return {
        type: ActionTypes.FILTER_UPDATE,
        name,
        value
    }
};