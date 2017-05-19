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

export const formatDate = (date) => {
	
	//convert dateTime to String
	date = "" + new Date(date);
	//date example: Fri May 19 2017 22:17:18 GMT+0200 (Stredoeurópsky čas (letný))
	const index = date.lastIndexOf("GMT");
	return date.substr(0,index-1);
}