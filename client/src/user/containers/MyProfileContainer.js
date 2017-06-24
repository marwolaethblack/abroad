import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { fetchPostsByIds, fetchPostsByUserId } from '../../post/actions/postActions';


import MyProfilePage from '../MyProfilePage';
import Loader from '../../widgets/Loader';

class MyProfileContainer extends Component {
	componentDidMount() {
		const { myUserId } = this.props;
		this.props.getUser(myUserId);
	}

	render() {
		const { user, usersPosts, postsPages, authenticated, isFetching, myUserId } = this.props;
		if(isFetching.users) {
			return (<Loader />);
		} else {
			if(!user.userData) {
				return(<h1 className="main-page-content">No user found</h1>)
			}
			return (<MyProfilePage 
					  {...user} 
					  usersPosts={usersPosts}
					  postsPages={postsPages}
					  location={this.props.location}
					  authenticated={authenticated} 
					  getPostsByUserId={this.props.getPostsByUserId} 
					  isFetching={isFetching} />
			);
		}
	}
}


const mapStateToProps = (state) => {
	return {
		myUserId: state.auth.id,
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
		getPostsByUserId(userId,page,limit){
			dispatch(fetchPostsByUserId(userId,page,limit))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileContainer);