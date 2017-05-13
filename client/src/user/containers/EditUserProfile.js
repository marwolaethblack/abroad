import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditUserForm from '../EditUserForm';

import { fetchUser, editUser } from '../actions/userActions';

class EditUserProfile extends Component {

  componentDidMount(){
    this.props.getUser(this.props.myUserId);
  }

    render() {

        return(
            <div className="container main-page-content">
              
              <EditUserForm 
                userInfo={this.props.user}
                editUser={this.props.updateUser}
              />

            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    myUserId: state.auth.id,
    user: state.user.userData,
    isFetching: state.isFetching,
    authenticated: state.auth.authenticated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser(id) {
      dispatch(fetchUser(id));
    },
    updateUser(id, editedFields) {
      dispatch(editUser(id, editedFields));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditUserProfile);