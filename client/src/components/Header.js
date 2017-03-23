import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


class Header extends Component {
  render() {
    return (
      <header className="container">
        <section className="brand-logo">
          <Link to="/">Abroad</Link>
        </section>
        <nav>
          <ul>
            <li>Register</li>
            <li>Login</li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header;