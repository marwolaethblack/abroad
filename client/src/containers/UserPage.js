import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserPage extends Component {
	componentDidMount() {
		const { id } = this.props.params;

	}

	render() {
		return(<div>User page</div>);
	}
}




export default UserPage;