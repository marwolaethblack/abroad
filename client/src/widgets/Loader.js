import React from 'react';

const LoaderStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  width: '5rem',
  height: '5rem',
  border: '1rem solid black',
  borderTop: '1rem solid white',
  marginTop: '-2.5rem',
  marginLeft: '-2.5rem',
  borderRadius:'50%',
  animation: 'spin 2s linear infinite'

}

function Loader (props) {
	return( 
		<div style={LoaderStyles} ></div>
	);
}

export default Loader;