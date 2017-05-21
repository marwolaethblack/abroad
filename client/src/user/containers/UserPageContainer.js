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
		const { user, usersPosts, isFetching, postsPages, getPostsByIds, location } = this.props;
		if(isFetching.users) {
			return (<Loader />);
		} else {
			if(!user.userData) {
				return(<h1 className="main-page-content">No user found</h1>)
			}
			return (<UserPage 
						{...user}
						usersPosts={usersPosts}
						postsPages={postsPages} 
						loadUsersPosts={getPostsByIds} 
						location={location}
						isFetching={isFetching} />
			);
		}
	}
}


const mapStateToProps = (state) => {
	return {
		user: state.user,
		usersPosts: state.posts.data,
		postsPages: state.posts.pages,
		isFetching: state.isFetching,
		authenticated: state.auth.authenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUser(id) {
			dispatch(fetchUser(id));
		},
		getPostsByIds(postsIds,page,limit){
			dispatch(fetchPostsByIds(postsIds,page,limit))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPageContainer);