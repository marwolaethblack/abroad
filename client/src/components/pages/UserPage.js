import React, { Component } from 'react';
import { Link } from 'react-router';
import Post from '../Post';
import UsersPosts from '../UsersPosts';

export default function UserPage(props) {
	const { username, email, comments, posts, _id } = props.userData;
	const { id, authenticated, loadUsersPosts, usersPosts, isFetching} = props; //ID from the URL 
	console.log("USER's posts Ids: ");
	console.log(posts);
	return(
		<section className="container">
			<figure>
				<img src="http://placehold.it/350x150"/>
				<figcaption>
					<h1>{username}</h1>
					{id === _id ? <Link to={`user/${id}/settings`}>Settings</Link> : ""}
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




