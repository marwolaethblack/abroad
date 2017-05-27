//add 3 last digits of the current timestamp
//to make the filename longer for the file system
export function changeFilename(originalFilename){

	const index = originalFilename.lastIndexOf('.');
	const timestamp = Date.now();

	return  originalFilename.substr(0,index) + timestamp.toString().substr(-3) + originalFilename.substr(index);
}