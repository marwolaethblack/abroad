import { ActionTypes } from '../constants';

const DEFAULT_FILTER = {
	country_from: "Slovakia",
	country_in: "Denmark",
	category: "work"
}

export const filter = (state=DEFAULT_FILTER,action) => {
    switch (action.type) {
        case ActionTypes.FILTER_UPDATE: {
        	let filterChange = {};
        	filterChange[action.name] = action.value;
            return {...state,...filterChange};
        }
        default:
            return state;
    }
}