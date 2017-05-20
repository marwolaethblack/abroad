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
  
    return <ul className="notif-content"> { notifications } </ul>;
  }

  renderPaginaton(){
    const { location } = this.props;
    let pages = this.props.notifPages;
    let pagination = [];

    const isActive = (pageNo) => {
      const { page } = location.query;
      return ((page == pageNo) || (!page && pageNo == 1));
    }

    if(pages){
      for(let pageNo=1; pageNo<=pages; pageNo++){
        pagination[pageNo] = (
          <li key={pageNo} className={(isActive(pageNo)) ? 'active' : ''}>
            <Link to={`/notifications?page=${pageNo}`}>{pageNo}</Link>
          </li>
        ) 
      }
    }
    return <ul> { pagination } </ul>
  }
  
  componentWillMount() {
    const { authenticated, location, userId, fetchNotif } = this.props;

    if(authenticated) {
      let page = location.query.page || 1;
      fetchNotif(userId, page);
    }
  }

  componentWillUpdate(prevProps){
    const { location, userId, fetchNotif } = this.props;

    if(prevProps.location.query.page !== location.query.page){
      fetchNotif(userId, location.query.page);
    }
  }

  render() {
    const { authenticated } = this.props;
    return (
      <section className="main-page-content">
        {authenticated &&
          <div id="all-notifications">
            { this.renderNotifications() }
            <span className="loader">{ this.props.loading && 'loading...' }</span>
            <div className="pagination">
              { this.renderPaginaton() }
            </div>
          </div>
        }
      </section>
    )
  }
}


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    userId: state.auth.id,
    filter: state.filter,
    notifications: state.notifications.onPage,
    notifPages: state.notifications.pages,
    loading: state.isFetching.notifications
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    fetchNotif(userId,page) {
      //3rd param in getNotificationsOnPage
      //is a number of notifications per page
      dispatch(getNotificationsOnPage(userId,page,2));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
