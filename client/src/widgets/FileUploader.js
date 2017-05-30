import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export const FILE_FIELD_NAME = 'image';

class FileUploader extends Component {

  constructor() {
    super()
    this.state = {
      acceptedFiles: [],
      rejectedFiles: []
    }
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  handleOnDrop(acceptedFiles, rejectedFiles){
    this.props.input.onChange(acceptedFiles);
    this.setState({ acceptedFiles, rejectedFiles });
  }

  render(){
  
    const files = this.props.input.value;
    return (
      <div id="fileUploader">
        <Dropzone
          accept="image/jpeg, image/png, image/gif, image/bmp"
          multiple={false}
          maxSize={3000000}
          name={this.props.name}
          onDrop={this.handleOnDrop}
        >
          <div className="description">
            Drop an image here, or click to select an image to upload.
            <br />
            Max size: 3MB
          </div>
          
        </Dropzone>

        { this.state.rejectedFiles.length > 0 &&
          <aside className="rejectedFiles">
          <h3>Rejected files</h3>
          <ul>
            {
              this.state.rejectedFiles.map(file => <li key={file.name}>{file.name} - {(file.size/1000000).toFixed(2)} MB</li>)
            }
          </ul>
        </aside> }

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
}

export default FileUploader;