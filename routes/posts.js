import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import UserModel from '../models/User';
import express from 'express';
import passport from 'passport';
import { date_ranges, getDateTimestamp } from '../client/src/constants/post_created_ranges';
import { POSTS_NO_PER_LOAD } from '../client/src/constants/pagination';


module.exports = (postSocket) => {

	const router = express.Router();
		
	router.get('/api/posts',(req,res) => {

		let query = req.query;
		
		// req.query._id/upvotes are false if no posts are loaded yet
		const lastPostId = query._id;
		delete query["_id"];

		const lastPostUpvotes = query.upvotes;
		delete query["upvotes"];

		//sortBy - e.g. by number of upvotes, latest/oldest posts
		const sortBy = query.sort;
		delete query["sort"];

		//number of posts to skip if they are sorted by upvotes
		const loadedPostsNo = Number(query.loadedPostsNo) || 0;
		delete query["loadedPostsNo"];

		//date-range when posts were published
		const datePosted = query.date_posted;
		delete query["date_posted"];

		const searchText = query.searchText;
		delete query["searchText"];

		//find posts whose title or content contain the searchText 
		if(searchText){
			query = {...query,$or:[
						{ title:new RegExp(searchText, "i")},
						{ content:new RegExp(searchText, "i")}
					]};
		}
		
		const getIdDateRange = (datePosted) => {
			if(datePosted && Object.values(date_ranges).indexOf(datePosted) > -1){
				if(datePosted !== "Anytime"){
					const dateTimestamp = getDateTimestamp(datePosted);
					const objectIdFromTimestamp = 
								Math.floor(dateTimestamp/1000).toString(16) + "0000000000000000";
					const idDateRange = {$gte: objectIdFromTimestamp};
					return idDateRange;
				}
			}
			return {$gte: "000000000000000000000000"};
		}


		// let query = req.query;
		let sortQuery = {_id:-1};

		const idDateRange = getIdDateRange(datePosted);
		query = {...query, $and:[{ _id:idDateRange }] }
		//adds lastPostId to dbQuery to optimize searching
		if(lastPostId){
			switch(sortBy){
				case "top":{
					//sortBy "top" uses skip() to load posts
					break;
				}
				case "oldest":{
					query = {...query, $and:[{ _id:{$gt: lastPostId}}, {_id:idDateRange}] }
					break; 
				}
				case "latest":
				default:{
					query = {...query, $and:[ {_id:{$lt: lastPostId}}, {_id:idDateRange} ]}
					break;
				}
			}
		}


	//posts sorting
		switch(sortBy){
			case "top":{
				sortQuery = { upvotes:-1, _id:-1}
				break;
			}
			case "oldest":{
				sortQuery = { _id:1 }
				break;
			}
			case "latest":
			default:{
				sortQuery = { _id:-1 }
				break;
			}
		}

		const loadPosts = (findQuery, sortQuery={ _id:-1 }, skip=0, limit=POSTS_NO_PER_LOAD) => {
			PostModel.find(findQuery).sort(sortQuery).limit(limit).skip(skip).lean().exec((err,posts) => {
					if(err){
						console.log(err);
					} else {
						res.json(posts);
					}
				});
		}
		
		if(sortBy === "top"){
			//if posts are sorted by number of upvotes, skip() must be used
			loadPosts(query,sortQuery,loadedPostsNo);
		} else {
			loadPosts(query,sortQuery);
		}
	});

	//Get related posts
	router.get('/api/relatedPosts',(req,res) => {

		if(req.query._id){
			const relatedPostsQuery = {
				_id: { $ne:req.query._id },
				country_from: req.query.country_from,
				country_in: req.query.country_in
			}

			PostModel.find(relatedPostsQuery).sort({ upvotes:-1, _id:-1}).limit(5).lean().exec((err,posts) => {
				if(err){
					console.log(err);
				} else {
					res.json(posts);
				}
			});
		}
	});


	//Get a single post
	router.get('/api/singlePost',(req,res) => {
		var roomId = req.query.id;
		postSocket.once('connection', function(socket) {
			socket.join(roomId);
		});

		PostModel.findById(req.query.id).populate({path: 'comments', options: {lean: true}}).exec((err, singlePost) => {
			if(err) console.log(err);

			res.json(singlePost);
		});

	});

	// //Get posts by IDs
	router.get('/api/postsByIds',(req,res) => {
		

		if(req.query){
			const postsIds = Object.values(req.query);

			PostModel.find({
		    	_id: { $in: postsIds }
		  	})
		    .exec((err, foundPosts) => {
			  	if(err) console.log(err);
			  	res.json(foundPosts);
			});
		}
	});

	//Add a new post
	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.post('/api/addPost', requireAuth, (req,res) => {

		let { newPost } = req.body;
		const { _id, username } = req.user;
		
		if(newPost){
			newPost.author = {
				id: _id,
				username
			}
			newPost.image = "https://placehold.it/350x150";

			const post = new PostModel(newPost);
			
			post.save((err,newPost) => {
				if(err) console.log(err);

			UserModel.findById(_id, function(err, foundAuthor) {
				if(err) {
					return res.status(422).send({error:err});
				}

				foundAuthor.posts.push(newPost);	
				foundAuthor.save();
			});
				res.json(post);
			});
		} else {
			return res.status(422).send({error:"Wuut? No post was sent."});
		}
	});

	//EDIT A POST
	router.put('/api/editPost', requireAuth, (req,res) => {

		let { postInfo } = req.body;
		const { _id, username } = req.user;

		if(Object.keys(postInfo).length){
			if(JSON.stringify(postInfo.authorId) === JSON.stringify(_id)) {		
				
				//update a post and return the edited post
				PostModel.findOneAndUpdate(
					{ _id: postInfo.postId },
					{...postInfo.editedFields}, 
					{new: true}
				)
				.populate("comments")
				.exec((err,editedPost) => {
						if(err) console.log(err);
						res.json(editedPost);
				});
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? Your post is WRONG!."});
		}
	});

	router.delete("/api/deletePost", requireAuth, (req, res) => {
		const { postId } = req.query;
		const { _id } = req.user;

		PostModel.findById(postId).lean().exec((err, foundPost) => {
			if(err) {
				console.log(err);
			}
			if(JSON.stringify(foundPost.author.id) === JSON.stringify(_id)) {
				PostModel.findOneAndRemove({ _id: postId }, (err) => {
					 if(err) console.log(err);
				});

				UserModel.findById(_id, function(err, foundAuthor) {
					if(err) {
						return res.status(422).send({error:err});
					}

					const postIndex = foundAuthor.posts.indexOf(postId);
					foundAuthor.posts.splice(postIndex,1);	
					foundAuthor.save();	
				});

					res.json(postId);	
			}
		});
	});

	return router;
}
