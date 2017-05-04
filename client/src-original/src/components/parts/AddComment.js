import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { addComment } from '../../actions/commentActions';
import { connect } from 'react-redux';

const { DOM: { textarea }} = React;

const AddComment = (props) => {

		const handleFormSubmit = (formProps) =>{
			const { postId } = props;
			const { comment } = formProps;
			props.postComment(postId, comment);
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
		postId: state.singlePost._id,
		errorMessage: state.errors
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postComment(postId, comment) {
			dispatch(addComment(postId, comment));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'addComment'
})(AddComment));