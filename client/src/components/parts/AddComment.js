import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { addComment } from '../../actions';
import { connect } from 'react-redux';

const { DOM: { textarea }} = React;

const AddComment = (props) => {

		const handleFormSubmit = (formProps) =>{
			const { authorId, postId, authorUsername } = props;
			const { comment } = formProps;
			console.log(comment);
			props.postComment(authorId, postId, authorUsername, comment);
		}

		const { handleSubmit, submitting, pristine} = props;
		return(
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div>
					<label>Add a comment</label>
					<div>
						<Field name="comment" component="textarea" />
					</div>
				</div>
					{props.errorMessage}
				<button disabled={submitting || pristine} type="submit" >Post</button>
			</form>
		);
};


const mapStateToProps = (state) => {
	return {
		authorId: state.auth.id,
		authorUsername: state.auth.username,
		postId: state.singlePost._id,
		errorMessage: state.errors
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postComment(authorId, postId, authorUsername, comment) {
			dispatch(addComment(authorId, postId,authorUsername, comment));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'addComment'
})(AddComment));