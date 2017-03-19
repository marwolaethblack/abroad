import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { fetchPosts } from '../actions';
import Header from '../components/Header';
import Footer from '../components/Footer';

class App extends Component {
  
  render() {
    const { children } = this.props;
    return (
      <div>
      <Header />
      {children}
      <Footer />
      </div>
    );
  }
}

export default App;