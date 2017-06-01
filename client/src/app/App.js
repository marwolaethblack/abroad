import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Header from './Header';
import Footer from './Footer';

import ExtendedPostPage from '../post/containers/ExtendedPostPage';

let postSocket = io('/post');

class App extends Component {
  
  componentWillUnmount() {
    postSocket.close();
  }

  renderChildren(props) {
      return React.Children.map(props.children, child => {
      if (child.type === ExtendedPostPage) {
        return React.cloneElement(child, {socket: postSocket})
      } else {
        return child
      }
    });
  }

  render() {
    return (
      <div className="main">
        <Header />
        <div id="main-content">
          {this.renderChildren(this.props)}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;