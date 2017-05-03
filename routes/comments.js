import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
var mongoose = require('mongoose');
var Authentication = require("../auth/controllers/authentication");
var passportService = require("../auth/services/passport");
var passport = require("passport");
var express = require('express');


module.exports = function(postSocket) {

	var router = express.Router();

	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.put('/api/addComment', requireAuth, (req,res) => {
		var { postId, comment, parentId } = req.body;
		var { user } = req;
		var { _id, username } = req.user;
		if(comment.length > 1000 || comment.length === 0) {
			return res.status(422).send({error:"Comment must be between 0 and 1000 characters long"});
		}

		PostModel.findById(postId, function(err, foundPost) {
			if(err) {
				return res.status(422).send({error:err});
			}

			if(parentId) {
				CommentModel.findById(parentId).lean().exec(function(err, fComment) {
					var parents = fComment.parents;
					var newComment = new CommentModel ({
						content: comment,
						upvotes: 0,
						postId: foundPost._id,
						author: {
							id: _id,
							username: username
						},
						comments: []
					});

					parents.push(newComment._id);
					newComment.parents = parents;
					console.log(parents);

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
								//postSocket.to(postId).emit('add comment', populatedPost.comments);
							});
						});
					});
				});
			} else {
				var newComment = new CommentModel ({
						content: comment,
						upvotes: 0,
						postId: foundPost._id,
						author: {
							id: _id,
							username: username
						},
						parents: [],
						comments: []
					});

				newComment.parents.push(newComment._id);

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
							//postSocket.to(postId).emit('add comment', populatedPost.comments);
						});
					});
				});
			}
		});
	});

	//EDIT A COMMENT
	router.put('/api/editComment', requireAuth, (req,res) => {

		//commentInfo = { editedComment, commentId, authorId }
		let { commentInfo } = req.body;
		var { _id, username } = req.user;

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
		var { commentId } = req.query;
		var { _id } = req.user;
		
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


	return router;

}