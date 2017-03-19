import React, { Component } from 'react';

class SimplePostFilter extends Component {
  render() {
    return (
      <div>
        <select>
            <option>Slovakia</option>
            <option>Narnia</option>
        </select>
        <select>
            <option>Slovakia</option>
            <option>Narnia</option>
        </select>
        <select>
            <option>Work</option>
            <option>Accommodation</option>
            <option>Trade</option>
            <option>Events</option>
        </select>
      </div>
    )
  }
}

export default SimplePostFilter;