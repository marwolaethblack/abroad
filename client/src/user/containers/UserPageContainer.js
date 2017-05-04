import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { fetchPostsByIds } from '../../post/actions/postActions';


import UserPage from '../UserPage';
import Loader from '../../widgets/Loader';

class UserPageContainer extends Component {
	componentDidMount() {
		const { id } = this.props.params;
		this.props.getUser(id);
	}

	render() {
		const { user, usersPosts, authenticated, isFetching } = this.props;
		const { id } = this.props.params; //The ID from the URL used as a prop for <UserPage/>
		if(isFetching.users) {
			return (<Loader />);
		} else {
			if(!user.userData) {
				return(<h1>No user found</h1>)
			}
			return (<UserPage {...user} 
							  id ={ id }
							  usersPosts={usersPosts} 
							  authenticated={authenticated} 
							  loadUsersPosts={this.props.getPostsByIds} 
							  isFetching={isFetching} />
			);
		}
	}
}


const mapStateToProps = (state) => {
	return {
		user: state.user,
		usersPosts: state.posts,
		isFetching: state.isFetching,
		authenticated: state.auth.authenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUser(id) {
			dispatch(fetchUser(id));
		},
		getPostsByIds(postsIds){
			dispatch(fetchPostsByIds(postsIds))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPageContainer);