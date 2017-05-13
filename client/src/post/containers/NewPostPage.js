import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../actions/postActions';

import AddPostForm from '../AddPostForm';
// import Loader from '../components/parts/Loader';


class NewPostPage extends Component {

	render() {
		const { addNewPost, newPostForm } = this.props;
		const handleAddPost = () =>{		
			addNewPost(newPostForm.values);
		}

		return (
			<AddPostForm addPost={handleAddPost} />
		)
	}
}


const mapStateToProps = (state) => {
	return {
		newPostForm: state.form.addPostForm
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addNewPost(post) {
			dispatch(addPost(post));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPostPage);