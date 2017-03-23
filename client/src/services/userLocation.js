import axios from 'axios';
import countries from '../constants/countries';

export function getUserCountryCode(){
	return axios.get("http://ipinfo.io/geo")
			    .then(res => {
			   		return res.data.country;
				 })
			    .catch(err => {
			    	console.log(err);
			    })
}