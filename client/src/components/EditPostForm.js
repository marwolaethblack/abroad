import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

const renderOptions = (options) => {
  if(Array.isArray(options)){
    return options.map((optionValue,i) => 
    <option key={i} value={optionValue}>{optionValue}</option>);
  }
  return Object.keys(options).map((key,i) => 
    <option key={i} value={options[key]}>{options[key]}</option>);
}

class FormInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      content: this.props.content
    }
    this.onContentChange = this.onContentChange.bind(this);
  }

  onContentChange(e){
    this.setState({ content: e.target.value });
  }

  render(){
    const { input, label, placeholder, type, options, initialText, inputValue, meta: { touched, error, warning } } = this.props;

    const renderInputType = (type) => {
      switch(type){
        case "select":{
          return (
            <select {...input} type={type} placeholder={placeholder} >
              {initialText && <option value="">{initialText}</option>}
              { renderOptions(options) }
            </select>
          )
        }
        case "textarea":{

          return (
            <textarea {...input} placeholder={placeholder} value={this.state.content} onChange={this.onContentChange}/>
          )
        }
        case "text":
        default: {
          return <input {...input} type={type} placeholder={placeholder} />
        }
      } 
    }

    return (
      <div>
        <label>{label}</label>
        <div>
          { renderInputType(type) }
          
          {touched && ((error && <span>{error}</span>) || ( touched && warning && <span>{warning}</span>))}
        </div>
      </div>
    )
  }
}

  const isInputEmpty = (value) => {
    if(!value) {
      return true;
    } 
    return false;
  }

  const validate = (values) => {
    const { content } = values;
    const errors = {};

      if(isInputEmpty(content)){
        errors.content = "required field";
      }

      return errors;
  };


const EditPostForm = props => {
  const { handleSubmit, editPost, postContent, postId, authorId, pristine, submitting } = props;
  const { DOM: { textarea }} = React;

  const hadleFormSubmit = (editedFields) => {
    editPost({editedFields, postId, authorId});
  }

  return (
    <form onSubmit={handleSubmit(hadleFormSubmit)}>

      <Field 
        name="content" 
        component={FormInput}
        content={postContent}
        type="textarea"
        label="Content" />

      <div>
        <button type="submit" disabled={ submitting }>EDIT</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'editPostForm', // a unique identifier for this form
  validate
})(EditPostForm);
