import moment from 'moment';
import rangePlugin from 'moment-precise-range-plugin';

//returns time/date difference between date post was created and now
const postDateDiff = (mongoObjectId) => {
	const datePosted = new Date(parseInt(mongoObjectId.substring(0, 8), 16) * 1000);
	const dateDiffObject = moment.preciseDiff(datePosted, moment(), true); 
	let output = '';
	delete dateDiffObject['firstDateWasLater'];

	Object.keys(dateDiffObject).some(timeUnit => {
		if(dateDiffObject[timeUnit] !== 0){
			output = `${dateDiffObject[timeUnit]} ${timeUnit}`;
			//removes "s" from timeUnit,e.g. hours -> hour
			if(dateDiffObject[timeUnit] === 1){
				output = output.substring(0,output.length-1);
			}
			return true;
		}
	})
	return output;
}
	
export default postDateDiff;