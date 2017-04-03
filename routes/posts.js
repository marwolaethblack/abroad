import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import express from 'express';
import { POSTS_NO_PER_LOAD } from '../client/src/constants/pagination';

const router = express.Router();

router.get('/api/posts',(req,res) => {
	
	// NO SORT
	// req.query._id is false if no posts are loaded
	const lastPostId = req.query._id;

	console.log("======================================");
	let query;
	if(lastPostId){
		query = {...req.query, _id:{$gt: lastPostId}}
	} else{
		delete req.query["_id"];
		query = req.query;
	}

	console.log("======================================");
	console.log("REQ.QUERY: "+JSON.stringify(query));
	console.log("======================================");
	console.log("======================================");

		PostModel.find(query).limit(POSTS_NO_PER_LOAD).lean().exec((err,posts) => {
		if(err){
			console.log(err);
		} else {
			res.json(posts);
		}
	});

});

//Get a single post
router.get('/api/singlePost',(req,res) => {
	PostModel.findById(req.query.id).populate({path: 'comments', options: {lean: true}}).exec((err,singlePost) => {
		if(err) console.log(err);
		res.json(singlePost);
	});
});



export default router;