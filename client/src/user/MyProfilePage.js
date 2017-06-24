import React from 'react';
import { Link } from 'react-router';
import Linkify from 'react-linkify';
import Post from '../post/Post';
import UsersPosts from '../post/UsersPosts';

export default function MyProfilePage(props) {
	const { id, username, image, about, countryIn, countryFrom, comments, posts } = props.userData;
	const { getPostsByUserId, usersPosts, postsPages, isFetching, location} = props; 

	return(
		<section className="container main-page-content">
			<figure id="user-info">	
				<figcaption>
					<h1>{username}</h1>
					{ about && <Linkify> <p>{about}</p> </Linkify> }
					{ countryFrom && <p>I'm from {countryFrom}</p> }
					{ countryIn && <p>I currently live in {countryIn} </p> }
					<Link to={'/my-profile/edit'}>Edit profile</Link>
					<br/>
					<Link to={'/my-profile/subscriptions'}>Edit my notification subscriptions</Link>
				</figcaption>
				<img src={image ? image : "http://placehold.it/350x150"} className="profile-pic"/>
			</figure>

			<section>
				<UsersPosts
				 location={location} 
				 getPostsByUserId={getPostsByUserId}
				 usersPosts={usersPosts}
				 postsPages={postsPages}
				 userId={id} 
				 isFetching={isFetching} />
			</section>
		</section>
	);
}




