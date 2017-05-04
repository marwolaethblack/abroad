import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { addComment } from './actions/commentActions';
import { connect } from 'react-redux';

const { DOM: { textarea }} = React;

const ReplyCommentForm = (props) => {
 
    const handleFormSubmit = (formProps) =>{
      const { comment } = formProps;
      const { commentId, postId } = props;
      props.reply(postId, comment, commentId);
      props.afterSubmit();
    }

    const { handleSubmit, submitting, pristine} = props;
    return(
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label>Reply</label>
          <div>
            <Field name="comment" placeholder="Reply must be between 1-1000 characters long" component="textarea" />
          </div>
        </div>
          {props.errorMessage}
        <button disabled={submitting || pristine} type="submit" >Submit</button>
      </form>
    );
};


const mapStateToProps = (state) => {
  return {
    errorMessage: state.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reply(postId, comment, parentId) {
      dispatch(addComment(postId, comment, parentId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'replyComment'
})(ReplyCommentForm));