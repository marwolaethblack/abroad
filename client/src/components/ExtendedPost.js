import React, { Component } from 'react';

class ExtendedPost extends Component {
    
  render() {
    const { upvotes, image, title, content, category, date, author, comments } = this.props;
    
    return (
      <article>
        <span>Upvotes {upvotes}</span>
            <img src={image}/>
            <h3>{title}</h3>
            <span>Submitted {date} ago by {author !== undefined&& author.username } to {category}</span>
            <span>{comments !== undefined&& comments.length}</span>
            <section className="post-content">
            { content }
            </section>
            <section className="post-comments">

            </section>
      </article>
    )
  }
}

export default ExtendedPost;

