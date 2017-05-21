import React from 'react';
import { Link } from 'react-router';
import Post from '../post/Post';
import UsersPosts from '../post/UsersPosts';

export default function MyProfilePage(props) {
	const { username, image, country_in, country_from, comments, posts } = props.userData;
	const { loadUsersPosts, usersPosts, postsPages, isFetching, location} = props; 

	return(
		<section className="container main-page-content">
			<figure id="user-info">	
				<figcaption>
					<h1>{username}</h1>
					{ country_from && <p>I'm from {country_from}</p> }
					{ country_in && <p>I currently live in {country_in} </p> }
					<Link to={'/my-profile/edit'}>Edit profile</Link>
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




