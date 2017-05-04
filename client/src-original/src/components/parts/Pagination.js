import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Pagination extends Component {
    
  render() {
  	const { elementsNo,perPage } = this.props;
  	const pagesNo = Math.ceil(elementsNo/perPage);
  	const currentUrlQuery = this.context.router.location.query;
    return (
      <div className="container">
      	<ul>
	        {	
	        	Array(pagesNo).fill().map((x,i) => 
	        		<li key={i}>
		        		<Link to={{pathname:"posts",query:{...currentUrlQuery,page:i+1}}}>
		        		 {i+1}
		        		 </Link>
	        		</li>
	        	)
	    	}
    	</ul>
      </div>
    )
  }
}

Pagination.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Pagination.propTypes = {
	perPage: PropTypes.number,
	elementsNo: PropTypes.number.isRequired
}

Pagination.defaultProps = {
	perPage: 5,
	elementsNo: 0
}

export default Pagination;