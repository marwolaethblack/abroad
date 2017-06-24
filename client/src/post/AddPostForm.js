import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import countries from '../constants/countries';
import categories from '../constants/categories';
import FileUploader, { FILE_FIELD_NAME } from '../widgets/FileUploader';


const isInputEmpty = (value) => {
  if(!value) {
    return true;
  } 
  return false;
}

const isInputAllowed = (value, allowedSet) => {
  if(!Array.isArray(allowedSet)){
    allowedSet = Object.values(allowedSet);
  }

  if (allowedSet.indexOf(value) === -1) {
     return false;
  }
  return true;
}

const validate = (values) => {
  const { title, countryFrom, countryIn, category, content } = values;
  let errors = {};

    if(isInputEmpty(title)){
      errors.title = "required field";
    }

    if(isInputEmpty(countryFrom)){
      errors.countryFrom = "required field";
    } else if(!isInputAllowed(countryFrom, countries)){
      errors.countryFrom = "value not allowed";
    }

    if(isInputEmpty(countryIn)){
      errors.countryIn = "required field";
    } else if(!isInputAllowed(countryIn, countries)){
      errors.countryIn = "value not allowed";
    }

    if(isInputEmpty(category)){
      errors.category = "required field";
    } else if(!isInputAllowed(category, categories)){
      errors.category = "value not allowed";
    }

    if(isInputEmpty(content)){
      errors.content = "required field";
    }

    return errors;
};

const warn = values => {
  const warnings = {}
  if (values.content && values.content.length < 100) {
    // warnings.content = 'Please make sure that you mentioned all important details.'
  }
  return warnings
}

const renderOptions = (options) => {
  if(Array.isArray(options)){
    return options.map((optionValue,i) => 
    <option key={i} value={optionValue}>{optionValue}</option>);
  }
  return Object.keys(options).map((key,i) => 
    <option key={i} value={options[key]}>{options[key]}</option>);
}

const renderField = (
  { input, label, placeholder, maxLength, type, options, initialText, meta: { touched, error, warning } },
) => {

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
          <textarea {...input} placeholder={placeholder} />
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
};

const AddPostForm = props => {
  const { handleSubmit, addPost, pristine, submitting } = props;
  // const { DOM: { textarea }} = React;

  //remove option "All" from categories
  const index = categories.indexOf("All");
  const postCategories = [...categories];
  postCategories.splice(index,1);

  return (
    <form onSubmit={handleSubmit(addPost)} 
    encType="multipart/form-data"
    className="main-page-content sign-form offset-by-three five columns">
    <h1>Add a post</h1>
      <Field
        name="title"
        component={renderField}
        label="Title"
        type="text"
        placeholder="Enter a descriptive title" />

      <Field 
        name="content" 
        component={renderField}
        type="textarea"
        label="Content" />

      <Field 
        name="countryFrom" 
        component={renderField} 
        type="select"
        initialText="Choose a country"
        options={countries}
        label="From" />
   
      <Field 
        name="countryIn" 
        component={renderField} 
        type="select"
        initialText="Choose a country"
        label="In"
        options={countries} />
   
      <Field 
        name="category" 
        component={renderField} 
        type="select"
        initialText="Choose a category"
        label="Category"
        options={postCategories} />

        <label htmlFor={FILE_FIELD_NAME}>( optional ) Image:</label>
        <Field 
        name={FILE_FIELD_NAME} 
        component={FileUploader} />

      <div>
        <button type="submit" disabled={submitting}>ADD</button>
      </div>
    </form>
  );
};



AddPostForm = reduxForm({
  form: 'addPostForm', // a unique identifier for this form
  validate,
  warn
})(AddPostForm);

AddPostForm = connect()(AddPostForm)

export default AddPostForm;


