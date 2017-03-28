import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signoutUser } from '../actions/authentication';


class Header extends Component {
  renderLinks() {
    if(this.props.authenticated) {
      //show a link to sign out
    return (
    <li>
      <Link to="/" onClick={() => this.props.signout()}>Sign Out</Link>
    </li> );
    } else {
      //show link to sign in or sign up
      return [
      <li key={1}>
        <Link to="/signin">Sign In</Link>
      </li>,
      <li key={2}>
        <Link to="/signup">Sign Up</Link>
      </li>
      ];
    
    }

  }

  render() {
    return (
      <header className="container">
        <section className="brand-logo">
          <Link to="/">Abroad</Link>
        </section>
        <nav>
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