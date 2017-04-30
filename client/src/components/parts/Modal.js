import React, { Component } from 'react';

class Modal extends Component {
	render() {

	  	const modalWindowStyle = {

		    position: "fixed", /* Stay in place */
		    zIndex: 1, /* Sit on top */
		    left: 0,
		    top: 0,
		    width: "100%", /* Full width */
		    height: "100%", /* Full height */
		    overflow: "auto", /* Enable scroll if needed */
		    backgroundColor: "rgb(0,0,0)", /* Fallback color */
		    backgroundColor: "rgba(0,0,0,0.4)" /* Black w/ opacity */
	  	}

	  	const modalContentStyle = {
	  		backgroundColor: "#fefefe",
		    margin: "5% auto", /* 5% from the top and centered */
		    padding: "20px",
		    border: "1px solid #888",
		    width: "80%" /* Could be more or less, depending on screen size */
	  	}

	  	const modalHeaderStyle = {
	  		padding: "2px 16px",
		    backgroundColor: "#5cb85c",
		    color: "white"
	  	}

	  	const { isOpen, children, onClose, title } = this.props;

	  	if(isOpen){
			return (
				<section style={modalWindowStyle}>

					<div style={modalHeaderStyle}>
					    <button style={{float:"right",color:"white"}} onClick={onClose}>CLOSE X</button>
					    <h2>{title}</h2>
				  	</div>

					<div style={modalContentStyle}>
						{ children }
					</div>

				</section>
			 ) 
	  	}
	  	return null;
  
	}
}

export default Modal;