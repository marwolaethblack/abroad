import axios from 'axios';

export function getUserCountryCode(){
	return axios.get("http://ipinfo.io/geo")
			    .then(res => {
			   		return res.data.country;
				 })
			    .catch(err => {
			    	console.log(err);
			    })
}