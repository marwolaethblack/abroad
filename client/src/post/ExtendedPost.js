import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import postDateDiff from '../services/dateDifference';
import Comment from '../comment/Comment';
import AddComment from '../comment/AddComment';
import Modal from '../widgets/Modal';
import EditPostForm from './EditPostForm';
import SharePost from './SharePost';
import ReplyCommentForm from '../comment/ReplyCommentForm';
import { newLineToBreak, spaceToDash, beautifyUrlSegment } from '../services/textFormatting';
import { fbPromises } from '../authentication/social/fb';
import fbConfig from '../../../auth/config/fb';
import FacebookProvider, { Share } from 'react-facebook';


class ExtendedPost extends Component {

  addMetaTags = (postObject) => {

    // create this: <html prefix="og: http://ogp.me/ns#">
    let htmlTag = document.getElementsByTagName('html')[0];
    let attr = document.createAttribute("prefix");
    attr.value = 'og: http:/\/ogp.me/ns#';  
    htmlTag.setAttributeNode(attr);  

    //url,title,description,image -> properties recognized by FB Open Graph
    //for sharing a post on FB
    Object.keys(postObject).forEach(key => {
          let meta = document.createElement('meta');

          //create attribute - property
          var attr = document.createAttribute("property");
          attr.value = 'og:'+key;  
          meta.setAttributeNode(attr);  
          
          meta.content = postObject[key];
          document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }

  componentWillMount() { 
    const { socket }  = this.props;
    socket.emit('roomPost', this.props._id);
    socket.on('add comment', (payload) => this.props.socketAddComment(payload));
  }

  componentDidMount(){
     //create meta tags for FB sharing
    const {image, title, content, category, country_in } = this.props;
    const url = `http:/\/abroad-react-redux.herokuapp.com/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`
    this.addMetaTags({image, title, description: content, url });
  }

  constructor(){
    super();
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.openEditPostModal = this.openEditPostModal.bind(this);
    this.closeEditPostModal = this.closeEditPostModal.bind(this);
    
    this.state = {
      isEditPostModalOpen: false
    }
  }

  renderComments = (comments, deleteComment) => {
            if(comments.length !== 0)
            {
               return comments.map(comment => 
                <Comment {...comment} 
                         key={comment._id}
                         postId={this.props._id}
                         deleteComment={deleteComment} 
                         editComment={this.props.editComment}
                         authenticated={this.props.authenticated} />) 
            }
        return "No comments to show";
  }

  handleDeletePost = () => {
        this.props.deletePost(this.props._id);
  }

  openEditPostModal = () => {
        this.setState({ isEditPostModalOpen: true });
  }

  closeEditPostModal = () => {
        this.setState({ isEditPostModalOpen: false });
  }
    
  render() {
    const { upvotes, image, title, content, category, author, _id, deleteComment, editPost, country_from, country_in } = this.props;
    const comments = this.props.comments || [];
    const { authenticated } = this.props;
    const datePosted = postDateDiff(_id);
    const loggedUserId = localStorage.getItem('id');

  
    return (
      <article className="extended-post">

        <Modal isOpen={this.state.isEditPostModalOpen} 
               onClose={this.closeEditPostModal}
               title="EDIT POST">

          <EditPostForm postId={_id} 
            authorId={author._id} 
            editPost={editPost}
            onSubmitted={this.closeEditPostModal}
            postContent={content} />

        </Modal>

      <FacebookProvider appId={fbConfig.appID}>
        <Share
         href={`http://abroad-react-redux.herokuapp.com/posts/${_id}/${spaceToDash(country_in)}/${category}/${beautifyUrlSegment(title)}`}>
            <button>SHARE ON FB</button>
         </Share>
      </FacebookProvider>

        <span>Upvotes {upvotes}</span>
            <img alt={title} src={image}/>
            <h1>{title}</h1>
            <p>{country_from + " > " + country_in}</p>
            <span>Submitted {datePosted} ago by <Link to={`/user/${author._id}/${spaceToDash(author.username)}`}>{author.username }</Link> to {category}</span>
            <section className="post-content">
              { newLineToBreak(content) }
            </section>
        { loggedUserId === author._id && <button onClick={this.handleDeletePost}>DELETE POST</button> }
        { loggedUserId === author._id && <button onClick={this.openEditPostModal}>EDIT POST</button> }
            <section className="post-comments">
              <p>{comments.length + " comments"}</p>
              {authenticated ? <AddComment /> : <Link to="/signin">Sign in to add a comment.</Link>}
              {this.renderComments(comments, deleteComment)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;