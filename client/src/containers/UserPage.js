import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userActions';

import UserPage from '../components/pages/User';
import Loader from '../components/parts/Loader';

class UserPageContainer extends Component {
	componentDidMount() {
		const { id } = this.props.params;
		this.props.getUser(id);
	}

	render() {
		const { loading, user } = this.props;
		const { id } = this.props.params; //The ID from the URL used as a prop for <UserPage/>
		if(loading) {
			return (<Loader />);
		} else {
			if(!user.userData) {
				return(<h1>No user found</h1>)
			}
			return (<UserPage {...user} id ={ id } />);
		}
	}
}



const mapStateToProps = (state) => {
	return {
		user: state.user,
		loading: state.isFetching
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUser(id) {
			dispatch(fetchUser(id));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPageContainer);