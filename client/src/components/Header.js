import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signoutUser } from '../actions/authentication';


class Header extends Component {
  renderLinks() {
    if(this.props.authenticated) {
      //show a link to sign out
    return [
    <li className="navigation-link">
      <Link to="/"  onClick={() => this.props.signout()}>Sign Out</Link>
    </li> ,
    <li className="navigation-link">
      <Link to="/user"  >Profile</Link>
    </li>
     ];
    } else {
      //show link to sign in or sign up
      return [
      <li key={1} className="navigation-link">
        <Link to="/signin">Sign In</Link>
      </li>,
      <li key={2} className="navigation-link">
        <Link to="/signup">Sign Up</Link>
      </li>
      ];
    
    }

  }

  render() {
    return (
      <header className={this.props.show ? "main-header show" : "main-header"}>
        <section className="brand-logo">
          <Link to="/" className="navigation-link">Abroad</Link>
        </section>
        <nav className="navigation-links">
          <ul>
            {this.renderLinks()}
          </ul>
        </nav>
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout() {
      dispatch(signoutUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);