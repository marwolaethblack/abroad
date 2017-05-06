import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signoutUser } from '../authentication/actions/authentication';
import { getNotifications, socketNotificationsUpdate } from '../user/actions/userActions';
import io from 'socket.io-client';

let notifSocket = io('/notif');


class Header extends Component {
   constructor() {
    super();
    //prop to show mobile menu
    this.state = { 
      showMenu: false,
      showNotifications: false
    };
  }

  renderLinks() {
    if(this.props.authenticated) {
      //show a link to sign out
    return [ 
    <li className="navigation-link" key={3}>
      <Link to="/add-post">Add Post</Link>
    </li>,
    <li className="navigation-link" key={4} onClick={this.toggleNotifications}>
      <div id="notifications-icon">
        <i className="fa fa-bell" aria-hidden="true"></i>
        <span id="notifications-number">{ this.props.notifications.length }</span>
      </div>
    </li>,
    <li className="navigation-link" key={2}>
      <Link to={"/user/" + this.props.id} >Profile</Link>
    </li>,
    <li className="navigation-link" key={1}>
      <Link to="/"  onClick={() => this.props.signout(notifSocket)}>Sign Out</Link>
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

  renderNotifications(){
    let notifications = <li> No new notifications </li>;

    if(this.props.notifications.length > 0){
      notifications = this.props.notifications.map((notification,i) => {
        return (
          <li key={i}> { notification.text } 
            { notification.postId && <Link to={`/posts/view/${notification.postId}`} onClick={this.toggleNotifications}> 
                >>> 
              </Link> 
            }
          </li>
        )
      });
    }
  
    return <ul> { notifications } </ul>;
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

  toggleMobileMenu = () => {
    this.setState( prevState => {
    if(prevState.showMenu){
      return { showMenu : !prevState.showMenu, showNotifications: false }
    }
     return { showMenu : !prevState.showMenu }
    });
  }

  toggleNotifications = () => {
    this.setState(prevState => {
        return { showNotifications: !prevState.showNotifications }
    });
  }


  hamburger = (
    <div id="hamburger">
      <div></div>
      <div></div>
      <div></div>
    </div>
  )

  render() {
    return (

      <header>
        <button id="mobile-menu-button" onClick={this.toggleMobileMenu} >
          {this.state.showMenu ? "X" : this.hamburger}
        </button>
        <div className={`main-header ${this.state.showMenu && "show"}`}>
          <section className="brand-logo">
            <Link to="/" className="navigation-link">Abroad</Link>
            <Link to={{pathname:"posts",query:this.props.filter}} className="navigation-link">All&nbsp;Posts</Link>
          </section>
          <nav className="navigation-links">
            <ul>
              {this.renderLinks()}
            </ul>
          </nav>
        </div>
        <div id="notifications" className={this.state.showNotifications ? "show" : "hide"}>
          <button className="btn-close" onClick={this.toggleNotifications} >X</button>
          { this.renderNotifications() }
        </div>
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