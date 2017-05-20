import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signoutUser } from '../authentication/actions/authentication';
import { getLatestNotifications, socketNotificationsUpdate, notificationsWereSeen } from '../notification/actions/notifActions';
import io from 'socket.io-client';


let notifSocket = io('/notif');

class Header extends Component {
   constructor(props) {
    super(props);
    //prop to show mobile menu
    this.state = { 
      showMenu: false,
      showNotifications: false
    };
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };



  renderLinks() {
    if(this.props.authenticated) {
    let unseenNotifications = [];
    if(this.props.notifications && this.props.notifications.length > 0){
       unseenNotifications = this.props.notifications.filter(notif => !notif.seen);
    }
     
      //show a link to sign out
    return [ 
    <li className="navigation-link" key={3}>
      <Link to="/add-post" activeClassName="active">Add Post</Link>
    </li>,
    <li className="navigation-link" key={4} onClick={this.toggleNotifications}>
      <div id="notifications-icon">
        <i className="fa fa-bell" aria-hidden="true"></i>
        <span id="notifications-number">{ unseenNotifications.length }</span>
      </div>
    </li>,
    <li className="navigation-link" key={2}>
      <Link to={"/my-profile"} activeClassName="active">Profile</Link>
    </li>,
    <li className="navigation-link" key={1}>
      <Link to="/" onClick={() => this.props.signout(notifSocket)}>Sign Out</Link>
    </li>
     ];
    } else {
      //show link to sign in or sign up
      return [
      <li key={1} className="navigation-link" >
        <Link to="/signin" activeClassName="active">Sign In</Link>
      </li>,
      <li key={2} className="navigation-link">
        <Link to="/signup" activeClassName="active">Sign Up</Link>
      </li>
      ];
    
    }
  }

  renderNotifications(){
    let notifications;

    if(this.props.notifications && this.props.notifications.length > 0){
      notifications = this.props.notifications.slice(0,5).map((notification,i) => {
        return (
          <li key={i}> { notification.text } 
            { notification.postId && <Link to={`/posts/${notification.postId}`} onClick={this.toggleNotifications}> 
                &nbsp;>>> 
              </Link> 
            }
          </li>
        )
      });
    } else {
       notifications = <li> No new notifications </li>;
    }
  
    return (
      <ul>
        { notifications }
        <li><Link to="/notifications" onClick={this.toggleNotifications}>See all -></Link></li>
      </ul>
    );
 }
  
  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchLatestNotif(this.props.id);
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

  unseenNotificationsExist = (notifications) => {
    for(let n of notifications){
      if(!n.seen){
        return true;
      }
    }
    return false;
  }

  toggleNotifications = () => {
    this.setState(prevState => {
      if(!prevState.showNotifications && this.unseenNotificationsExist(this.props.notifications)){
        this.props.notificationsSeen(this.props.notifications, this.props.id);
      }

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

    const currentPathname = this.context.router.getCurrentLocation().pathname;
    const { authenticated } = this.props;

    return (
      <header>
        <button id="mobile-menu-button" onClick={this.toggleMobileMenu} >
          {this.state.showMenu ? "X" : this.hamburger}
        </button>
        <div className={`main-header ${this.state.showMenu && "show"}`}>
          <section className="brand-logo">
            <Link to="/" className="navigation-link">Abroad</Link>
              <Link to={{pathname:"/posts", query:this.props.filter}} className={`navigation-link ${currentPathname.indexOf('/posts') > -1 && "active"}`}>All&nbsp;Posts</Link>
          </section>
          <nav className="navigation-links">
            <ul>
              {this.renderLinks()}
            </ul>
          </nav>
        </div>
        {authenticated &&
          <div id="notifications" className={this.state.showNotifications ? "show" : "hide"}>
            <button className="btn-close" onClick={this.toggleNotifications} >X</button>
            { this.renderNotifications() }
          </div>
        }
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    id: state.auth.id,
    filter: state.filter,
    notifications: state.notifications.latest
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout(notifSocket) {
      dispatch(signoutUser(notifSocket));
    },
    //fetch only the first 5 notifications
    fetchLatestNotif(id) {
      dispatch(getLatestNotifications(id,5));
    },

    updateNotifications(notification) {
      dispatch(socketNotificationsUpdate(notification));
    },

    notificationsSeen(notifs, userId){
      dispatch(notificationsWereSeen(notifs, userId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

//  for later use
// <Link to={{pathname:"/posts",query:this.props.filter}} className={`navigation-link ${this.context.router.location.pathname === "/posts" ? "active" : ""}`}>All&nbsp;Posts</Link>