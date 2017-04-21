import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import express from 'express';
import passport from 'passport';
import { date_ranges, getDateTimestamp } from '../client/src/constants/post_created_ranges';
import { POSTS_NO_PER_LOAD } from '../client/src/constants/pagination';

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
	
	console.log("======================================");
	console.log("REQ.QUERY: "+JSON.stringify(query));

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
		console.log("relatedPostsQuery:"+JSON.stringify(relatedPostsQuery));

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
	PostModel.findById(req.query.id).populate({path: 'comments', options: {lean: true}}).exec((err, singlePost) => {
		if(err) console.log(err);
		res.json(singlePost);
	});
});


//Add a new post
const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

router.post('/api/addPost', requireAuth, (req,res) => {

	let { newPost } = req.body;
	const { _id, username } = req.user;
	
	if(newPost){
		newPost.author = {
			id: _id,
			username,
			upvotes: 0,
			comments: [],
			image:"https://placehold.it/350x150"
		}

		const post = new PostModel(newPost);
		
		post.save((err,newPost) => {
			if(err) console.log(err);
			res.json(post);
		});

	} else {
		return res.status(422).send({error:"Wuut? No post was sent."});
	}

});

export default router;