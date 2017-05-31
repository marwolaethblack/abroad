var PostModel = require('../models/Post');
var CommentModel = require('../models/Comment');
var UserModel = require('../models/User');
var express = require('express');
var passport = require('passport');
import { date_ranges, getDateTimestamp } from '../client/src/constants/post_created_ranges';
import { createFilePath } from '../services/fileUpload';
import mkdirp from 'mkdirp';
import multer from 'multer';
import fs from 'fs';




module.exports = (postSocket) => {

	var router = express.Router();

	// //destination to the folder with uploaded files
	// var upload = multer({ 'dest': __dirname+'/uploads/posts' });
		
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
	router.get('/api/singlePost',function(req,res) {
		var roomId = req.query.id;
		postSocket.once('connection', function(socket) {
			socket.join(roomId);
		});

		PostModel.findById(req.query.id)
		.populate({path: 'comments', options: {lean: true},  populate : {path : 'author', options: {lean: true, select: '_id username'}}})
		.populate({path: 'author', options: {lean: true, select: '_id username'}})
		.exec(function(err, singlePost){
			if(err){
				console.log(err);
				res.status(500).send({error:err});
			} 

			res.json(singlePost);
		});

	});

	// //Get posts by IDs
	router.get('/api/postsByIds',function(req,res) {
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

	//Add a new post
	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	// configuring Multer to use files directory for storing files
	const storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
	  	const dir = './uploads/posts/'+createFilePath(file.originalname);
	  	mkdirp(dir, function (err) {
		    if (err){
		    	console.error(err);
		    } 
		    else {
		    	callback(null, dir);
		    }
		});
	  },
	  filename: function (req, file, callback) {
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

	router.post('/api/addPost', requireAuth, upload.single('image'), function(req,res) {

		var newPost = req.body;
		var userId = req.user._id;

		if(newPost){
			newPost.author = { _id : userId};
			newPost.comments = [];

			if(req.file){
				//remove 'uploads' from the file destination
				const cutOff = 'uploads';
				const index = req.file.destination.indexOf(cutOff);
				newPost.image = req.file.destination.substr(index + cutOff.length) + "/"+req.file.filename;
			} else {
				// newPost.image = "https://placehold.it/350x150";
			}
			

			var post = new PostModel(newPost);
			
			post.save(function(err,newPost) {
				if(err) console.log(err);

			UserModel.findById(userId, function(err, foundAuthor) {
				if(err) {
					return res.status(422).send({error:err});
				}

				foundAuthor.posts.push(newPost);	
				foundAuthor.save();
			});
				res.json(post);
			});
		} else {
			return res.status(422).send({error:"Wuut? No post was sent."});
		}
	});

	//EDIT A POST
	router.put('/api/editPost', requireAuth, function(req,res) {

		var postInfo = req.body.postInfo;
		var userId = req.user._id;

		if(Object.keys(postInfo).length){
			if(JSON.stringify(postInfo.authorId) === JSON.stringify(userId)) {		
				
				//update a post and return the edited post
				PostModel.findOneAndUpdate(
					{ _id: postInfo.postId },
					postInfo.editedFields, 
					{new: true}
				)
				// .populate({path: ['comments','author.id'], options: {lean: true}})
				.exec(function(err,editedPost) {
						if(err) console.log(err);
						res.json(editedPost);
				});
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? Your post is WRONG!."});
		}
	});

	router.delete("/api/deletePost", requireAuth, function(req, res) {
		var postId = req.query.postId;
		var _id = req.user._id;

		PostModel.findById(postId).lean().exec(function(err, foundPost) {
			if(err) {
				console.log(err);
			}

			if(JSON.stringify(foundPost.author) === JSON.stringify(_id)) {
				PostModel.findOneAndRemove({ _id: postId }, function(err,removedDoc) {
					 if(err) console.log(err);

					 //delete an image of the deleted post from the file system
					 const imgPath = './uploads'+removedDoc.image;
					 //check if the image exists
					 fs.stat(imgPath, (err,stats) => {
					 	if(stats){
					 		//delete the image
					 		fs.unlink(imgPath, (err) => {
							  if (err) console.log(err);
							});
						 } 
					 }); 
				});

				UserModel.findById(_id, function(err, foundAuthor) {
					if(err) {
						return res.status(422).send({error:err});
					}

					var postIndex = foundAuthor.posts.indexOf(postId);
					foundAuthor.posts.splice(postIndex,1);	
					foundAuthor.save();	
				});

					res.json(postId);	
			}
		});
	});

	return router;
}