import { FILE_FIELD_NAME } from '../widgets/FileUploader';
import { changeFilename }  from './fileUpload';


export function trimFormValues(formObject){

	//trim values of form fields
    let formValues = Object.values(formObject);
    if(Array.isArray(formValues)){
        Object.keys(formObject).forEach(key => {
            if(typeof formObject[key] === "string"){
                formObject[key] = formObject[key].trim();
            }
        });
    }
    return formObject;
}


//assign form fields into FormData to send the form as multipart/form-data
export function createFileFormData(formObject){
    let body = new FormData();
    Object.keys(formObject).forEach(( key ) => {
        if(key === FILE_FIELD_NAME){
            //check if a new file is being uploaded
            if(Array.isArray(formObject[FILE_FIELD_NAME])){

                //change the filename if it's shorter
                //than 6 chars together with its extension
                let fileName = formObject[FILE_FIELD_NAME][0].name;
                if(fileName.length <= 6) {
                    fileName = changeFilename(fileName);
                }
                body.append(key, formObject[ key ][0], fileName);
            }         
        } else {
            body.append(key, formObject[ key ]);
        }
    });

    return body;
}
