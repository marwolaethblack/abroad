import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signoutUser } from '../authentication/actions/authentication';
import { getNotifications, socketNotificationsUpdate } from '../user/actions/userActions';
import io from 'socket.io-client';

let notifSocket = io('/notif');


class Header extends Component {
  renderLinks() {
    if(this.props.authenticated) {
      //show a link to sign out
    return [
    <li className="navigation-link" key={2}>
      <Link to={"/user/" + this.props.id} >Profile</Link>
    </li>,
    <li className="navigation-link" key={1}>
      <Link to="/"  onClick={() => this.props.signout(notifSocket)}>Sign Out</Link>
    </li>,
    <li className="navigation-link" key={3}>
      <Link to="/add-post" className="navigation-link">Add Post</Link>
    </li>
     ];
    } else {
      //show link to sign in or sign up
      return [
      <li key={1} className="navigation-link">
        <Link to="/signin">Sign In</Link>
      </li>,
      <li key={2} className="navigation-link">
        <Link to="/signup">Sign Up</Link>
      </li>
      ];
    
    }
  }

  
  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchNotif(this.props.id);
      notifSocket.emit('room', this.props.id);
      notifSocket.on('new notification', (payload) => {
        this.props.updateNotifications(payload)
      });
    }
  }

  componentWillUnmount() {
    notifSocket.close();
  }

  render() {
    return (
      <header className={this.props.show ? "main-header show" : "main-header"}>
        <section className="brand-logo">
          <Link to="/" className="navigation-link">Abroad</Link>
        </section>
        <nav className="navigation-links">
          <ul>
            <Link to={{pathname:"posts",query:this.props.filter}} className="navigation-link">All Posts</Link>
            {this.renderLinks()}
          </ul>
        </nav>
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    id: state.auth.id,
    filter: state.filter,
    notifications: state.notifications
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout(notifSocket) {
      dispatch(signoutUser(notifSocket));
      console.log("fuck")
      console.log(notifSocket)
    },

    fetchNotif(id) {
      dispatch(getNotifications(id));
    },

    updateNotifications(notification) {
      dispatch(socketNotificationsUpdate(notification));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);