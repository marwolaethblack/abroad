import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import express from 'express';
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



//Get a single post
router.get('/api/singlePost',(req,res) => {
	PostModel.findById(req.query.id).populate({path: 'comments', options: {lean: true}}).exec((err,singlePost) => {
		if(err) console.log(err);
		res.json(singlePost);
	});
});



export default router;