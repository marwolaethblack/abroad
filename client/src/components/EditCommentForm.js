import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';



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
        errors.content = "The comment has not been changed.";
      }

      return errors;
};

class CommentInput extends Component {
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
    const { input, label, placeholder, meta: { touched, error, warning } } = this.props;

    return (
      <div>
        <label>{label}</label>
        <div>
           <textarea {...input} placeholder={placeholder} value={this.state.content} onChange={this.onContentChange}/>
          
          {touched && ((error && <span>{error}</span>) || ( touched && warning && <span>{warning}</span>))}
        </div>
      </div>
    )
  }
}

class EditCommentForm extends Component {
  
  constructor(props){
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  } 

  handleFormSubmit = (editedComment) => {
    const { commentId, authorId, postId, editComment } = this.props;
    this.props.editComment({editedComment, commentId, authorId, postId});
  }

  render(){
    const { handleSubmit, editComment, commentContent, commentId, authorId, pristine, submitting } = this.props;
    const { DOM: { textarea }} = React;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>

        <Field 
          name="content" 
          component={CommentInput}
          content={commentContent}
          label="Comment" />

        <div>
          <button type="submit" disabled={ submitting }>EDIT</button>
        </div>
      </form>
    );
  }
};

export default reduxForm({
  form: 'editCommentForm', // a unique identifier for this form
  validate
})(EditCommentForm);
