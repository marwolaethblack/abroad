import React, { Component } from 'react';

export default function UserPage(props) {
	const { username, email, comments, posts } = props.userData;
	return(
		<section className="container">
			<figure>
				<img src="http://placehold.it/350x150"/>
				<figcaption>
					<h1>{username}</h1>
					<span>{email}</span>
				</figcaption>
			</figure>
		</section>
	);
}




