var CommentModel = require('../models/Comment');
var PostModel = require('../models/Post');
var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var mongoose = require('mongoose');
var Authentication = require("../auth/controllers/authentication");
var passportService = require("../auth/services/passport");
var passport = require("passport");
var express = require('express');
import { spaceToDash } from '../services/textFormatting';

module.exports = function(postSocket, notificationSocket) {

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
						author: { _id },
						comments: []
					});

					parents.push(newComment._id);
					newComment.parents = parents;

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

								if(JSON.stringify(fComment.author) !== JSON.stringify(user._id)) {

										UserModel.findById(fComment.author, function(err, fUser) {
										var notifText = ` has replied to your comment in post: ${foundPost.title}`;
										var newNotif = new NotificationModel({
											postId: foundPost._id,
											text: notifText,
											author: { _id: user._id }
										});

										newNotif.save(function(err) {
											fUser.notifications.push(newNotif);
											fUser.save();
											notificationSocket.to(fUser._id.toString())
											.emit('new notification', {...newNotif._doc, author: { _id:user._id, username:user.username } });
										})
									});
								}


								if(JSON.stringify(user._id) !== JSON.stringify(foundPost.author)) {

									UserModel.findById(foundPost.author, function(err, fUser) {
										var notifText = ' has commented on your post: '+ foundPost.title;
										var newNotif = new NotificationModel({
											postId: foundPost._id,
											text: notifText,
											author: { _id: user._id }
										});


										newNotif.save(function(err) {
											fUser.notifications.push(newNotif);
											fUser.save();
											notificationSocket.to(fUser._id.toString()).emit('new notification', {...newNotif._doc, author:{ _id: user._id, username: user.username } });
										})
									 });
							   	 }
							});
						});
					});
				});
			} else {
				var newComment = new CommentModel ({
						content: comment,
						upvotes: 0,
						postId: foundPost._id,
						author: { _id },
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
							postSocket.to(postId).emit('add comment', populatedPost.comments);							
							

							if(JSON.stringify(user._id) !== JSON.stringify(foundPost.author)) {

								UserModel.findById(foundPost.author, function(err, fUser) {
									// "<Link to=user/"+user._id+"/"+user.username "+ " has commented on your post: " + foundPost.title;
									var notifText = ` has commented on your post: ${foundPost.title}`;
									var newNotif = new NotificationModel({
										postId: foundPost._id,
										text: notifText,
										author: { _id: user._id }
									});


									newNotif.save(function(err) {
										fUser.notifications.push(newNotif);
										fUser.save();
										notificationSocket.to(fUser._id.toString()).emit('new notification', {...newNotif._doc, author: {_id: user._id, username: user.username} });
									})

								});
							}
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
						if(err){
							console.log(err);
							res.json(err);
						} 
					CommentModel.find({postId: editedComment.postId}).lean().exec(function(err, comments) {
						res.json(comments);
					});
						
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
			if(JSON.stringify(foundComment.author._id) === JSON.stringify(_id)) {
				CommentModel.findByIdAndRemove(commentId, (err) => {
					if(err) {
						console.log(err);
						res.json(err);
					}

					//delete all children comments of the deleted comment
					CommentModel.find({ _id:{$gt:commentId}, postId:foundComment.postId}).lean().exec((err,postComments) => {
						var commentChildren = [];

						postComments.forEach(comment => {
							
							var commentStringParents = comment.parents.map(parent => {
								return parent.toString();
							});

							if(commentStringParents.indexOf(commentId.toString()) > -1){
								commentChildren.push(comment._id);
							}
						});

						CommentModel.remove({ _id: {$in:commentChildren }},(err) => {
							if(err){
								console.log(err);
								res.json(err);
							}

							//get a post with updated comments
							PostModel.findByIdAndUpdate(foundComment.postId,{ $pull: {comments: {$in: [...commentChildren,commentId] }}}, {multi:true,new:true})
								.populate({path: 'comments', options: {lean: true}}).exec((err, singlePost) => {
									if(err){
										console.log(err);
										res.json(err);
									} 
									res.json(singlePost.comments);
							});
						});
					});
				});
			} else {
				res.json({err: "error"});
			}
		})
	});


	return router;

}