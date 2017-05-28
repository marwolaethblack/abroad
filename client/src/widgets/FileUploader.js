import React from 'react';
import Dropzone from 'react-dropzone';

export const FILE_FIELD_NAME = 'image';

const FileUploader = (field) => {
  const files = field.input.value;
  return (
    <div>
      <Dropzone
        accept="image/jpeg, image/png, image/gif, image/bmp"
        multiple={false}
        maxSize={3000000}
        name={field.name}
        onDrop={( filesToUpload, e ) => {field.input.onChange(filesToUpload)}}
      >
        <div>Drop an image here, or click to select an image to upload.</div>
        <span>Max size: 3MB</span>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="error">{field.meta.error}</span>}

        {files && Array.isArray(files) && (
          <ul>
            { files.map((file, i) => <li key={i}>
                  <span> {file.name} - {(file.size/1000000).toFixed(2)} MB </span>
                  <img className="fileUploadPreview" src={file.preview} />
              </li>) }
          </ul>
        )}

    </div>
  );
}

export default FileUploader;