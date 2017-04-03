import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
const Authentication = require("../auth/controllers/authentication");
const passportService = require("../auth/services/passport");
const passport = require("passport");
import express from 'express';
const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

router.put('/api/addComment', requireAuth, (req,res) => {
	const { authorId, postId, authorUsername, comment } = req.body;
	if(comment.length > 1000 || comment.length === 0) {
		return res.status(422).send({error:"Comment must be between 0 and 1000 characters long"});
	}

	PostModel.findById(postId, function(err, foundPost) {
		if(err) {
			return res.status(422).send({error:err});
		}

		const newComment = new CommentModel ({
			content: comment,
			upvotes: 0,
			author: {
				id: authorId,
				username: authorUsername
			}
		});

		foundPost.comments.push(newComment);
		newComment.save((err) => {

			if(err) {
				console.log(err);
			}

			foundPost.save((err)=> {

				if(err) {
					console.log(err);
				}
				
				PostModel.populate(foundPost, { path: 'comments'}, function(err, populatedPost) {
					if(err) {
						console.log(err);
					}
					res.json(populatedPost);
				});
			});
		});
		
	});
});





export default router;