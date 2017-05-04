import React, { Component } from 'react';
import SortLink from '../widgets/SortLink';

class SortFilter extends Component {


    render() {
    	const { location } = this.props;
    	// const iconAscending = (<i className="fa fa fa-sort-asc" aria-hidden="true"></i>);
    	// const iconDescending = (<i className="fa fa fa-sort-desc" aria-hidden="true"></i>);
        return (
	        <section className="container">
				<SortLink currentUrl={location} sortBy="top" />
				<SortLink currentUrl={location} sortBy="latest" />
				<SortLink currentUrl={location} sortBy="oldest" />        	
	        </section>
	    )
    }
}

export default SortFilter;