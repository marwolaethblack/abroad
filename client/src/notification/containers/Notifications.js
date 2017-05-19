import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotificationsOnPage } from '../actions/notifActions';
import { formatDate } from '../../services/textFormatting';


class Notifications extends Component {
  
  renderNotifications(){
    let notifications;

    if(this.props.notifications.length > 0){
      notifications = this.props.notifications.map((notification,i) => {
        return (
          <li key={i}>
            <span>{ formatDate(notification.createdAt) }</span>
            <span>
              { notification.text } 
              { notification.postId && <Link to={`/posts/${notification.postId}`} onClick={this.toggleNotifications}> 
                  &nbsp;>>> 
                </Link> 
              }
            </span>
          </li>
        )
      });
    } else {
       notifications = <li> No notifications yet. </li>;
    }
  
    return <ul> { notifications } </ul>;
 }
  
  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchNotif(this.props.id,20);
    }
  }


  render() {
    const { authenticated } = this.props;
    return (
      <section className="main-page-content">
        {authenticated &&
          <div id="all-notifications">
            { this.renderNotifications() }
          </div>
        }
      </section>
    )
  }
}


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    id: state.auth.id,
    filter: state.filter,
    notifications: state.notifications.onPage,
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    fetchNotif(userId) {
      dispatch(getNotificationsOnPage(userId,20));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
