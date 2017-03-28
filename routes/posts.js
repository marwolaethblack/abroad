import PostModel from '../models/Post';
import CommentModel from '../models/Comment';
import express from 'express';
const router = express.Router();

router.get('/api/posts',(req,res) => {
	console.log("FUCK: "+JSON.stringify(req.query));
	PostModel.find(req.query).lean().exec((err,posts) => {
		if(err) console.log(err);
		res.json(posts);
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