import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userActions';

class UserPage extends Component {
	componentDidMount() {
		const { id } = this.props.params;
		this.props.getUser(id);

	}

	render() {
		return(

			<div><span>{this.props.error&& this.props.error}</span>
			{this.props.user&& this.props.user.username}</div>
		);
	}
}



const mapStateToProps = (state) => {
	return {
		user: state.user.userData,
		error: state.user.error
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUser(id) {
			dispatch(fetchUser(id));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);