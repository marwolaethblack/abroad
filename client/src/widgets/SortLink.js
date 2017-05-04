import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SortLink extends Component {


    
  render() {
  	const { currentUrl, sortBy } = this.props;
  	const isSelected = (sortType) => {
  		const sortFromUrl = currentUrl.query.sort;
  		return (sortFromUrl === sortType || (!sortFromUrl && sortBy === "latest")) ? "selected-sort" : "";
  	}

  	//temporary style
  	const linkStyle = {
    	marginLeft:"15px"
    } 
    		
    return (
        <Link style={linkStyle} className={isSelected(sortBy)} to={{pathname:currentUrl.pathname,query:{...currentUrl.query,sort:sortBy}}}>
		        { sortBy.toUpperCase() } 
		</Link>	
    )
  }
}

export default SortLink;