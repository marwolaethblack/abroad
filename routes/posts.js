import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import express from 'express';
import { POSTS_NO_PER_LOAD } from '../client/src/constants/pagination';

const router = express.Router();

router.get('/api/posts',(req,res) => {
	
	// req.query._id/upvotes are false if no posts are loaded yet
	const lastPostId = req.query._id;
	delete req.query["_id"];

	const lastPostUpvotes = req.query.upvotes;
	delete req.query["upvotes"];

	//sortBy - e.g. by number of upvotes, latest/oldest posts
	const sortBy = req.query.sort;
	delete req.query["sort"];

	//number of posts to skip if they are sorted by upvotes
	const loadedPostsNo = Number(req.query.loadedPostsNo) || 0;
	delete req.query["loadedPostsNo"];


	let query = req.query;
	let sortQuery = {_id:-1};
	//adds lastPostId to dbQuery to optimize searching
	if(lastPostId){
		switch(sortBy){
			case "top":{
				// query = {...query, upvotes:{$lte: lastPostUpvotes}, _id:{$ne:lastPostId}}
				break;
			}
			case "oldest":{
				query = {...query, _id:{$gt: lastPostId}}
				break;
			}
			case "latest":
			default:{
				query = {...query, _id:{$lt: lastPostId}}
				break;
			}
		}
	}

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
	console.log("======================================");
	console.log("sortQuery: "+JSON.stringify(sortQuery));

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
		console.log("skip: "+loadedPostsNo);
		loadPosts(query,sortQuery,loadedPostsNo);
	} else {
		loadPosts(query,sortQuery);
	}
});



//Get a single post
router.get('/api/singlePost',(req,res) => {
	PostModel.findById(req.query.id).populate({path: 'comments', options: {lean: true}}).exec((err,singlePost) => {
		if(err) console.log(err);
		res.json(singlePost);
	});
});



export default router;