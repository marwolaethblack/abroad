import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
const Authentication = require("../auth/controllers/authentication");
const passportService = require("../auth/services/passport");
const passport = require("passport");
import express from 'express';


module.exports = function(postSocket) {

	const router = express.Router();

	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.put('/api/addComment', requireAuth, (req,res) => {
		const { postId, comment } = req.body;
		const { user } = req;
		const { _id, username } = req.user;
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
				level: 1,
				author: {
					id: _id,
					username: username
				}
			});

			foundPost.comments.push(newComment);
			user.comments.push(newComment);

			newComment.save((err) => {

				if(err) {
					console.log(err);
				}

				user.save();

				foundPost.save((err)=> {

					if(err) {
						console.log(err);
					}
					
					PostModel.populate(foundPost, { path: 'comments'}, function(err, populatedPost) {
						if(err) {
							console.log(err);
						}
						res.json(populatedPost);
						postSocket.to(postId).emit('add comment', populatedPost.comments);
					});
				});
			});
			
		});
	});

	//EDIT A COMMENT
	router.put('/api/editComment', requireAuth, (req,res) => {

		//commentInfo = { editedComment, commentId, authorId }
		let { commentInfo } = req.body;
		const { _id, username } = req.user;

		if(commentInfo){
			if(JSON.stringify(commentInfo.authorId) === JSON.stringify(_id)) {		
				
				//update a comment and return the edited comment
				CommentModel.findOneAndUpdate(
					{ _id: commentInfo.commentId },
					{...commentInfo.editedComment}, 
					{new: true}
				)
				// .populate("comments")
				.exec((err,editedComment) => {
						if(err) console.log(err);
						res.json(editedComment);
				});
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? Your comment is WRONG!!!."});
		}
	});


	router.delete("/api/deleteComment", requireAuth, (req, res) => {
		const { commentId } = req.query;
		const { _id } = req.user;
		
		CommentModel.findById(commentId).lean().exec((err, foundComment) => {
			if(err) {
				console.log(err);
			}
			if(JSON.stringify(foundComment.author.id) === JSON.stringify(_id)) {
				CommentModel.findByIdAndRemove(commentId, (err) => {
					if(err) {
						console.log(err);
						res.json(err);
					}
					res.json(commentId);
				});
			} else {
				res.json({err: "error"});
			}
		})
	});


	router.put('/api/replyComment', requireAuth, (req,res) => {
		const { commentId, reply, postId } = req.body;
		const { user } = req;
		const { _id, username } = req.user;
		if(reply.length > 1000 || reply.length === 0) {
			return res.status(422).send({error:"Comment must be between 0 and 1000 characters long"});
		}

		CommentModel.findById(commentId, function(err, foundComment) {
			if(err) {
				return res.status(422).send({error:err});
			}
			if(foundComment.level === 4) {
				return res.status(422);
			}

			const newComment = new CommentModel ({
				content: reply,
				upvotes: 0,
				level: foundComment.level + 1,
				author: {
					id: _id,
					username: username
				}
			});

			foundComment.comments.push(newComment);
			user.comments.push(newComment);

			newComment.save((err) => {

				if(err) {
					console.log(err);
				}

				user.save();

				foundComment.save((err)=> {

					if(err) {
						console.log(err);
					}
					console.log(postId);
					PostModel.findById(postId)
						.populate("comments")
						.exec(function(err, populatedPost) {
						if(err) {
							console.log(err);
						}

						res.json(populatedPost);
						postSocket.to(postId).emit('add comment', populatedPost.comments);
					});
				});
			});
			
		});
	});

	return router;

}


