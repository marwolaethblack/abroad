import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../helpers/dateDifference';
import { beautifyUrlSegment, spaceToDash } from '../helpers/textFormatting';


class FrontPagePost extends Component {
    
  render() {
    const { title,content,category,country_in,_id } = this.props;
    const datePosted = postDateDiff(_id);
    return (
      <div className="front-page-post">
        <div className="card-top">
          <Link to={`/posts/${_id}/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`}><h2>{ title }</h2></Link>
          <h4>{ category }</h4>
        </div>
        <div className="card-bottom">
          <p>{ content }</p>
          <span>Posted {datePosted} ago</span>
        </div>
      </div>
    )
  }
}

FrontPagePost.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired
}

export default FrontPagePost;

