import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


class Header extends Component {
  render() {
    return (
      <header>
        <section className="brand-logo">
          <Link to="/">Abroad</Link>
        </section>
        <nav>
          <ul>
            <li></li>
            <li></li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header;