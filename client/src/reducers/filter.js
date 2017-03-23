import { ActionTypes } from '../constants';
import categories from '../constants/categories'

let DEFAULT_FILTER = {
	country_from: "Slovakia",
	category: categories
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