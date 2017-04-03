import React, { Component } from 'react';
import { Link } from 'react-router';

class SortFilter extends Component {


    render() {
    	const { location } = this.props;
    	const iconAscending = (<i className="fa fa fa-sort-asc" aria-hidden="true"></i>);
    	const iconDescending = (<i className="fa fa fa-sort-desc" aria-hidden="true"></i>);
    	const isSelected = (sortType) => 
    		(location.query.sort === sortType) ? "selected-sort" : "";
    	

        return (
	        <section>
	        	<h2>SortFilter Component</h2>
		        	<Link className={isSelected("top")} to={{pathname:location.pathname,query:{...location.query,sort:"top"}}}>
		        		TOP
		        	</Link>	        	
	        </section>
	    )
    }
}

export default SortFilter;