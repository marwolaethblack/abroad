import React, { Component } from 'react';
import { Link } from 'react-router';
import Post from '../post/Post';
import UsersPosts from '../post/UsersPosts';

export default function UserPage(props) {
	const { username, country_in, country_from, email, comments, posts, _id } = props.userData;
	const { id, authenticated, loadUsersPosts, usersPosts, isFetching} = props; //ID from the URL 

	return(
		<section className="container">
			<figure>
				<img src="http://placehold.it/350x150"/>
				<figcaption>
					<h1>{username}</h1>
					{ country_from && <p>I'm from {country_from}</p> }
					{ country_in && <p>I currently live in {country_in} </p> }
					{id === _id ? <Link to={`/user/${id}/edit-profile`}>Edit profile</Link> : ""}
				</figcaption>
			</figure>

			<section>
				<UsersPosts loadUsersPosts={loadUsersPosts} 
				 postsIds={posts} 
				 usersPosts={usersPosts}
				 isFetching={isFetching} 
				 usersPosts={usersPosts} />

			</section>
		</section>
	);
}




