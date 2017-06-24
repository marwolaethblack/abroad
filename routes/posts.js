var PostModel = require('../models/Post');
var CommentModel = require('../models/Comment');
var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');
import { date_ranges, getDateTimestamp } from '../client/src/constants/post_created_ranges';
import { createFilePath } from '../services/fileUpload';
import mkdirp from 'mkdirp';
import multer from 'multer';
import fs from 'fs';

import connection from '../models/db';
import Sequelize from 'sequelize';
import Post from '../models/PostNew';
import User from '../models/UserNew';
import Comment from '../models/CommentNew';

module.exports = (postSocket, notificationSocket) => {

	var router = express.Router();
		
	router.get('/api/posts', function(req,res){

		var originalQuery = req.query;
		
		// req.query._id/upvotes are false if no posts are loaded yet
		var lastPostId = originalQuery._id;

		//last loaded post's number of upvotes, used for faster searching
		var lastPostUpvotes = originalQuery.upvotes;

		//sortBy - e.g. by number of upvotes, latest/oldest posts
		var sortBy = originalQuery.sort;

		//number of posts to skip if they are sorted by upvotes
		var loadedPostsNo = Number(originalQuery.loadedPostsNo) || 0;

		//date-range when posts were published
		var datePosted = originalQuery.date_posted;

		//words entered into text search
		var searchText = originalQuery.searchText;

		//the original query's fields are used to compose a desired db query 
		var query = {
			country_from: originalQuery.country_from, 
			country_in: originalQuery.country_in, 
		};
		if(originalQuery.category){
			query.category = originalQuery.category;
		}


		//find posts whose title or content contain the searchText 
		if(searchText){
			query = Object.assign({}, query, {
		       $or:[
								{ title:new RegExp(searchText, "i")},
								{ content:new RegExp(searchText, "i")}]
			});
		}
		
		//all returned posts' ids will have id $gte than 
		// the lowest possible objectID from the selected date-range
		var getIdDateRange = function(datePosted) {

			if(datePosted && datePosted !== "Anytime" && Object.values(date_ranges).indexOf(datePosted) > -1){
					var dateTimestamp = getDateTimestamp(datePosted);
					var objectIdFromTimestamp = 
								Math.floor(dateTimestamp/1000).toString(16) + "0000000000000000";
					var idDateRange = {$gte: objectIdFromTimestamp};
					return idDateRange;
			}
			return {$gte: "000000000000000000000000"};
		}

		//return the latest posts by default
		var sortQuery = {_id:-1};

		var idDateRange = getIdDateRange(datePosted);
	
		query = Object.assign({}, query, { $and:[{ _id:idDateRange }]});
		//adds lastPostId to dbQuery to optimize searching
		if(lastPostId){
			switch(sortBy){
				case "top": {
					break;
				}
				case "oldest":{
					query = Object.assign({}, query, {$and:[{ _id:{$gt: lastPostId}}, {_id:idDateRange}]});
					break; 
				}
				case "latest":
				default:{
					query = Object.assign({}, query, {$and:[ {_id:{$lt: lastPostId}}, {_id:idDateRange} ]});
					break;
				}
			}
		}


	//posts sorting
		switch(sortBy){
			//sortBy "top" uses skip() to load posts
			case "top":{
				sortQuery = [['upvotes', -1], ['_id', -1]];
				break;
			}
			case "oldest":{
				sortQuery = { _id:1 };
				break;
			}
			case "latest":
			default:{
				sortQuery = { _id:-1 };
				break;
			}
		}

		var loadPosts = function(filterQuery, sortQuery={ _id:-1 }, skip=0, limit=4){
			PostModel.find(filterQuery)
			.populate({path: 'author', options: {lean: true, select: '_id username'}})
			.sort(sortQuery)
			.limit(limit)
			.skip(skip).lean().exec(function(err,posts) {
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
	router.get('/api/relatedPosts', function(req,res) {

		if(req.query._id){
			var relatedPostsQuery = {
				_id: { $ne:req.query._id },
				country_from: req.query.country_from,
				country_in: req.query.country_in
			}

			PostModel.find(relatedPostsQuery).sort({ upvotes:-1, _id:-1}).limit(5).lean().exec(function(err,posts) {
				if(err){
					console.log(err);
					res.json(err);
				} else {
					res.json(posts);
				}
			});
		}
	});


	//Get a single post
	router.get('/api/postById', (req, res) => {
		const roomId = req.query.id;
		postSocket.once('connection', (socket) => {
			socket.join(roomId);
		});

		Post.findById( req.query.id, { raw: true })
			.then(foundPost => {
				if(foundPost){
					User.findById(
						foundPost.authorId, 
						{ raw:true, 
						  attributes: ['id','username','image','countryFrom','countryIn'] 
						})
						.then(foundUser => {
							if(foundUser){
								
								foundPost.author = foundUser;

								Comment.findAll({
									where: { postId: foundPost.id }
								})
								.then(foundComments => {
									foundPost.comments = foundComments || [];
									res.json(foundPost);

								})
								.catch(err => {
									res.status(500).send({error: err+": Couldn't fetch post's comments "})
								});
							} else {
								res.status(404).send({error:'User not found.'});
							}
						})
						.catch(err => {
							res.status(500).send({error:err+':find user by id error'});
						});
				} else {
					res.status(404).send({error:'Post not found.'});
				}
			})
			.catch(err => {
				res.status(500).send({error:err+':find post by id error'});
			});
	});

	// //Get posts by IDs
	router.get('/api/postsByIds', (req,res) => {
		if(req.query.Ids){
			let postsIds = Object.values(req.query.Ids);
			postsIds = Array.isArray(postsIds) ? postsIds : [postsIds];

			const page = req.query.page*1 || 1;
			const limit = req.query.limit*1 || 10;

		    PostModel.paginate(
				{ _id: { $in: postsIds }},
				{ page, limit, sort: { _id: -1 }},
				(err, result) => {
					if(err) {
						console.log(err);
						return res.status(422).send({error:err});
					}
					res.json(result);
			});
		}
	});

	//Get posts by userId
	router.get('/api/postsByUserId', (req,res) => {

		const { userId } = req.query;

		if(userId){

			const page = req.query.page*1 || 1;
			const limit = req.query.limit*1 || 10;

			Post.findAndCountAll({
			   where: {
			      authorId: userId
			   },
			   offset: (page-1)*limit,
			   limit
			})
			.then(posts => {
				res.json({ 
					posts: posts.rows,
					pages: Math.ceil(posts.count / limit)
				});
			})
			.catch(err => {
				res.status(500).send({ error: err+":Couldn't fetch user's posts." });
			});
		}
	});

	//Add a new post
	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	// configuring Multer to use files directory for storing files
	const storage =   multer.diskStorage({
	  destination: (req, file, callback) => {
	  	const dir = './uploads/posts/' + createFilePath(file.originalname);
	  	mkdirp(dir, function (err) {
		    if (err){
		    	console.error(err);
		    } 
		    else {
		    	callback(null, dir);
		    }
		});
	  },
	  filename: (req, file, callback) => {
	    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
	  }
	});

	//Upload only images of these formats
	const ALLOWED_FILE_TYPES = ['jpeg','png','gif','bmp'];
	const fileFilter = (req, file, cb) => {
 	
		const index = file.mimetype.indexOf('/');
		const uploadFileType = file.mimetype.substr(index+1);

		//check if the file being uploaded has an allowed extension 
	 	if(ALLOWED_FILE_TYPES.indexOf(uploadFileType) > -1){
		  // Accept the file
		  cb(null, true);
	 	} else {
	 	  // Reject the file 
		  cb(null, false);
	 	}
	}

	const upload = multer({ storage, fileFilter, limits: { fileSize: 3000000, files: 1 }, });

	router.post('/api/addPost', requireAuth, upload.single('image'), (req, res) => {

		let newPost = req.body;
		const userId = req.user.id;
		const reqUsername = req.user.username;

		if(newPost){
			// newPost.author = { _id : userId};
			// newPost.comments = [];

			if(req.file){
				//remove 'uploads' from the file destination
				const cutOff = 'uploads';
				const index = req.file.destination.indexOf(cutOff);
				newPost.image = req.file.destination.substr(index + cutOff.length) + "/"+req.file.filename;
			} else {
				// newPost.image = "https://placehold.it/350x150";
			}

			connection.sync()
			.then(() => {
				Post.create({
			        ...newPost,
			        authorId: userId
			     })
			    .then(createdPost => res.status(201).send(createdPost))
			    .catch(err => res.status(400).send(err));
			})
			.catch(err => console.log("SYNC ERR: " + err));	

			// var post = new PostModel(newPost);
			
			// post.save(function(err,newPost) {
			// 	if(err) console.log(err);

			// 	UserModel.findById(userId, function(err, foundAuthor) {
			// 		if(err) {
			// 			return res.status(422).send({error:err});
			// 		}

			// 		foundAuthor.posts.push(newPost);	
			// 		foundAuthor.save(function(err) {

			// 			UserModel.find({
			// 				$and: [
			// 					{ 'subscriptions.notifications_country': newPost.country_in },
			// 					{ 'subscriptions.notifications_category': newPost.category }
			// 				]
			// 			})
			// 			.exec(function(err, foundUsers) {
			// 				if(err) {
			// 					console.log(err);
			// 				}

			// 				var notif = new NotificationModel();
			// 					notif.postId = newPost._id;
			// 					notif.author = { _id: userId }
			// 					notif.text = ` has added a new post to the category ${newPost.category} in ${newPost.country_in}.`;
			// 					notif.save(function(err) {

			// 						for (var i = 0; i < foundUsers.length; i++) {
			// 							if(foundUsers[i].username.toString() === reqUsername.toString()) {
			// 								break;
			// 							}
			// 							foundUsers[i].notifications.push(notif);
			// 							foundUsers[i].save();
			// 							notificationSocket
			// 							.to(newPost.country_in.toString() + newPost.category.toString())
			// 							.emit("new notification", {...notif._doc,  author: { _id:userId, username: reqUsername } });
			// 						}	

			// 					});					

			// 			})
			// 		});
			// 	});

				// res.json(newPost);
				
			// });
		} else {
			return res.status(422).send({error:"Wuut? No post was sent."});
		}
	});

	//EDIT A POST
	router.put('/api/editPost', requireAuth, (req, res) => {

		const postInfo = req.body.postInfo;
		const userId = req.user.id;

		if(Object.keys(postInfo).length){
			if(JSON.stringify(postInfo.authorId) === JSON.stringify(userId)) {		
				
				//update a post and return the edited post
				console.log("editedPost:");
						console.log(postInfo.editedPost);
						console.log("===============");

				Post.update(
						{ ...postInfo.editedFields }, 
						{ where: { id: postInfo.postId },
						  raw: true,
						  returning: true
						}
	
					)
					.then(result => {

						const affectedCount = result[0];
						const affectedRows = result[1];

						if(affectedCount > 0){
							res.json(affectedRows[0]);
						} else {
							res.status(500).send({error: "failed to update a post" });
						}
					})
					.catch(err => {
						res.status(500).send({ error: err + ": failed to update a post" });
					});

				//update a post and return the edited post
				// PostModel.findOneAndUpdate(
				// 	{ _id: postInfo.postId },
				// 	postInfo.editedFields, 
				// 	{new: true}
				// )
				// .exec(function(err, editedPost) {
				// 		if(err) console.log(err);
				// 		res.json(editedPost.content);
				// });
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? Your post is WRONG!."});
		}
	});

	router.delete("/api/deletePost", requireAuth, (req, res) => {

		const postId = req.query.postId;
		const userId = req.user.id;

		Post.findById(postId, { raw: true, attributes: ['authorId'] })
			.then(foundPost => {
				if(JSON.stringify(foundPost.authorId) === JSON.stringify(userId)) {

					Post.destroy({ where: { id: postId }},{ limit: 1 })
						.then(deletedPost => {
							res.json(deletedPost);

							//delete an image of the deleted post from the file system
							 const imgPath = './uploads' + deletedPost.image;
							 //check if the image exists
							 fs.stat(imgPath, (err,stats) => {
							 	if(stats){
							 		//delete the image
							 		fs.unlink(imgPath, (err) => {
									  if (err) console.log(err);
									});
								 } 
							 }); 
						})
						.catch(err => {
							res.status(500).send({ error: err + ": Failed to delete the post" });
						});
				}
			})
			.catch(err => {
				res.status(500).send({ error: err + ": Failed to delete the post" });
			});
	});

	return router;
}