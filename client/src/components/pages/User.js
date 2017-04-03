import React, { Component } from 'react';
import { Link } from 'react-router';

export default function UserPage(props) {
	const { username, email, comments, posts, _id } = props.userData;
	const { id } = props; //ID from the URL 
	return(
		<section className="container">
			<figure>
				<img src="http://placehold.it/350x150"/>
				<figcaption>
					<h1>{username}</h1>
					{id === _id ? <Link to={`user/${id}/settings`}>Settings</Link> : ""}
				</figcaption>
			</figure>
		</section>
	);
}




