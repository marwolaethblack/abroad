import React from 'react';

export const beautifyUrlSegment = (segment) => {

	//replace all whitespaces with a single space
	segment = segment.replace(/\s\s+/g, ' ')
				//remove all these characters
				.replace(/[?!.()<>{}[\]"'`#^*:]/,'');

	//escape special characters in url
	segment = spaceToDash(segment)
			//replace all slashes with dashes
				.replace(new RegExp('%2F','g'),'-')
				//replace repeating dashed with a single dash
				.replace(/-+/g,"-")
				//remove a dash if it's the first or last character of the segment
				.replace(/^-|-$/,'');

	return segment;
}

export const spaceToDash = (text) => {
	return encodeURIComponent(text).replace(new RegExp('%20|%2F','g'),'-');
}


export const newLineToBreak = (text) => {

	text = text.replace(/\n+/g, '\n\n');

	return text.split('\n').map((item, key) => {
	  return <span key={key}>{item}<br/></span>
	});
}