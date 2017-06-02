import React, { Component } from 'react';
import { Link } from 'react-router';
import Linkify from 'react-linkify';
import Post from '../post/Post';
import UsersPosts from '../post/UsersPosts';


export default function UserPage(props) {
	const { username, image, about, country_in, country_from, email, comments, posts, _id } = props.userData;
	const { loadUsersPosts, usersPosts, postsPages, isFetching, location} = props; //ID from the URL 

	return(
		<section className="container main-page-content">
			<figure id="user-info">	
				<figcaption>
					<h1>{username}</h1>
					{ about && <Linkify> <p>{about}</p> </Linkify> }
					{ country_from && <p>I'm from {country_from}</p> }
					{ country_in && <p>I currently live in {country_in} </p> }
				</figcaption>
				<img src={image ? image : "http://placehold.it/350x150"} className="profile-pic"/>
			</figure>

			<section>
				 <UsersPosts
				 location={location} 
				 loadUsersPosts={loadUsersPosts}
				 usersPosts={usersPosts}
				 postsPages={postsPages}
				 postsIds={posts} 
				 isFetching={isFetching} />
			</section>
		</section>
	);
}




