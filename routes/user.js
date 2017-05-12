var UserModel = require('../models/User');
var CommentModel = require('../models/Comment');
var PostModel = require('../models/Post');
var express = require('express');
var passport = require('passport');


module.exports = function(notificationSocket) {
	var router = express.Router();
	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.get('/api/user', function(req,res) {
		UserModel.findById(req.query.id, {password: 0})
			// .populate('posts comments')
				.lean()
				.exec(function(err, user) {
			if(err) {
				return res.status(422).send({error:err});
			}
			res.json(user);
		});
	});

	router.put('/api/editUser', requireAuth, function(req,res) {

		let userInfo = req.body.userInfo;
		const _id = req.user._id;

		if(Object.keys(userInfo.editedFields).length){
			if(JSON.stringify(userInfo.userId) === JSON.stringify(_id)) {		
				
				//update a post and return the edited post
				UserModel.findOneAndUpdate(
					{ _id: userInfo.userId },
					userInfo.editedFields, 
					{new: true}
				)
				// .populate("comments")
				.exec(function(err,editedUser) {
						if(err) console.log(err);
						res.json(editedUser);
				});
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? User profile is WRONG!."});
		}
	});



	router.get('/api/user/notifications', function(req,res) {
		UserModel.findById(req.query.id)
			    .populate({path: 'notifications', options: {limit: 20, lean: true, sort:{'createdAt': -1}}})
				.exec(function(err, user) {
			if(err || !user) {
				console.log(err);
				return res.status(422).send({error:err});
			}
			res.json(user.notifications);

		});
	});

	return router;
}