import React, { Component } from 'react';

class UserPage extends Component {

	render() {
		console.log(this.props);
		return(
			<div><span>{this.props.error}</span>
			{this.props.userData.username}</div>
		);
	}
}



export default UserPage;