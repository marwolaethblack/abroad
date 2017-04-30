import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { replyComment } from '../actions';
import { connect } from 'react-redux';

const { DOM: { textarea }} = React;

const ReplyCommentForm = (props) => {
 
    const handleFormSubmit = (formProps) =>{
      const { reply } = formProps;
      const { commentId, postId } = props;
      console.log(postId);
      props.reply(reply, commentId, postId);
    }

    const { handleSubmit, submitting, pristine} = props;
    return(
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label>Reply</label>
          <div>
            <Field name="reply" placeholder="Reply must be between 1-1000 characters long" component="textarea" />
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
    reply(reply, commentId, postId) {
      dispatch(replyComment(reply, commentId, postId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'replyComment'
})(ReplyCommentForm));