import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Header from '../components/Header';
import Footer from '../components/Footer';

import ExtendedPostPage from './ExtendedPostPage';

let socket = io('/post');

class App extends Component {
  
  constructor() {
    super();
    //prop to show mobile menu
    this.state = {show:false};
  }


  toggleMobileMenu = () => {
    this.setState( { show : !this.state.show } );
  }

  renderChildren(props) {
      return React.Children.map(props.children, child => {
      if (child.type === ExtendedPostPage) {
        return React.cloneElement(child, {socket: socket})
      } else {
        return child
      }
    });
  }

  render() {
        return (
      <div className="main">
        <button id="mobile-menu-button" onClick={this.toggleMobileMenu} >X</button>
        <Header show={this.state.show}/>
        {this.renderChildren(this.props)}
        <Footer />
      </div>
    );
  }
}

export default App;