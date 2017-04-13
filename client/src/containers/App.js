import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

class App extends Component {
  
  constructor() {
    super();
    //prop to show mobile menu
    this.state = {show:false};
  }


  toggleMobileMenu = () => {
    this.setState( { show : !this.state.show } );
  }

  render() {
    const { children } = this.props;
        return (
      <div className="main">
        <button id="mobile-menu-button" onClick={this.toggleMobileMenu} >X</button>
        <Header show={this.state.show}/>
        {children}
        <Footer />
      </div>
    );
  }
}

export default App;