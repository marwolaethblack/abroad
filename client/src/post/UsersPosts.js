import React, { Component, PropTypes } from 'react';
import RelatedPost from './RelatedPost';
import { Link } from 'react-router';

class UsersPosts extends Component {

  componentWillMount() {
    const { location, postsIds, loadUsersPosts } = this.props;

      let page = location.query.page || 1;
      //3rd parameter => limit
      loadUsersPosts(postsIds, page, 3);
  }

  componentWillUpdate(nextProps){
    const { location, postsIds, loadUsersPosts } = this.props;

    if(nextProps.location.query.page !== location.query.page){
      loadUsersPosts(postsIds, nextProps.location.query.page,3);
    }
  }

  renderPaginaton(){
    const { location } = this.props;
    let pages = this.props.postsPages;
    let pagination = [];

    const isActive = (pageNo) => {
      const { page } = location.query;
      return ((page == pageNo) || (!page && pageNo == 1));
    }

    if(pages){
      for(let pageNo=1; pageNo<=pages; pageNo++){
        pagination[pageNo] = (
          <li key={pageNo} className={(isActive(pageNo)) ? 'active' : ''}>
            <Link to={`${location.pathname}?page=${pageNo}`}>{pageNo}</Link>
          </li>
        ) 
      }
    }
    return <ul> { pagination } </ul>
  }

  
  render() {
    const { isFetching, usersPosts } = this.props;

    if(this.props.postsIds.length === 0) 
      return <span style={{color:"red", fontSize:"2em"}}>No posts found.</span>

    //RelatedPost components is used also for user's posts
    return (
     <div className="users-posts">
        <h3>MY POSTS</h3>
       
          <div id="usersPosts">
            {usersPosts.map((post,index) => <RelatedPost key={post._id} {...post} />)}
            <span className="loader">{ this.props.isFetching.posts && 'loading...' }</span>

            <div className="pagination">
              { this.renderPaginaton() }
            </div>
          </div>
          
     </div>
    )
  }
}

export default UsersPosts;

UsersPosts.propTypes = {
  posts: PropTypes.array
}