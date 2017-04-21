import React from 'react';
import { Field, reduxForm } from 'redux-form';

import countries from '../constants/countries';
import categories from '../constants/categories';


const AddPostForm = props => {
  const { handleSubmit, addPost, formProps, pristine, submitting } = props;
  const { DOM: { textarea }} = React;
  //remove option "All" from categories
  const index = categories.indexOf("All");
  const postCategories = [...categories];
  postCategories.splice(index, 1);

  const renderOptions = (options) => {
    if(Array.isArray(options)){
      return options.map((optionValue,i) => 
      <option key={i} value={optionValue}>{optionValue}</option>);
    }
    return Object.keys(options).map((key,i) => 
      <option key={i} value={options[key]}>{options[key]}</option>);
  }

  return (
    <form onSubmit={handleSubmit(addPost)}>
      <div>
        <label>Title</label>
        <div>
          <Field
            name="title"
            component="input"
            type="text"
            placeholder="Enter a descriptive title"
          />
        </div>
      </div>
      <div>
        <label>From</label>
        <div>
          <Field name="country_from" component="select" >
            {renderOptions(countries)}
          </Field>
        </div>
      </div>
      <div>
        <label>In</label>
        <div>
          <Field name="country_in" component="select">
            {renderOptions(countries)}
          </Field>
        </div>
        <label>Category</label>
        <div>
          <Field name="category" component="select">
            {renderOptions(postCategories)}
          </Field>
        </div>
        <div>
          <label>Content</label>
          <div>
            <Field name="content" component="textarea" />
          </div>
        </div>
      </div>

      <div>
        <button type="submit" disabled={pristine || submitting}>ADD</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'addPostForm', // a unique identifier for this form
})(AddPostForm);
