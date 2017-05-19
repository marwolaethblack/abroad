var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');


module.exports = function(notificationSocket) {

	var router = express.Router();
	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.get('/api/user/notifications', requireAuth, function(req,res) {
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


	//change notifications's property 'seen' to true
	router.put('/api/notifications/seen', requireAuth, function(req,res) {

		UserModel.findById(req.body.userId)
			.lean()
			.exec(function(err, user) {
				if(err || !user) {
					return res.status(422).send({error:err});
				}

				NotificationModel.update(
				 { "_id": { $in: user.notifications }},
				 {"$set": { "seen":true }},
				 {"multi": true}, //for multiple documents
				 function(err){
				 	if(err) return console.error(err);   
				 }
				)
			});
	});
	

	return router;
}