import React, { Component, PropTypes } from 'react';
import { fbPromises } from '../authentication/social/fb';


class SharePost extends Component {

  componentWillMount() { 
    fbPromises.init();
  }

  componentDidUpdate(){
    fbPromises.init();
  }

  componentDidReceiveProps(){
    fbPromises.init();
  }


    
  render() {
    const { href} = this.props;

    return (
<div>
          <div className="fb-share-button" 
          data-href={this.props.href}
          data-layout="button_count"
          data-size="large">
          </div>
          </div>
    )
  }
}

export default SharePost;