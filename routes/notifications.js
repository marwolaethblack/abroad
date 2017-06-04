var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');


module.exports = function(notificationSocket) {

	var router = express.Router();
	var requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	//LATEST NOTIFICATIONS
	router.get('/api/notifications-latest', requireAuth, (req,res) => {
		
		//number of returned notifications;
		const limit = req.query.limit || 5;

		UserModel.findById(req.query.id)
			    .populate({path: 'notifications', options: {limit, lean: true, sort:{createdAt: -1}, populate : {path : 'author', options: {lean: true, select: '_id username'}}}})
				.exec((err, user) => {
					if(err || !user) {
						console.log(err);
						return res.status(422).send({error:err});
					}
					res.json(user.notifications);
				});
	});


	//NOTIFICATIONS WITH PAGINATION
	router.get('/api/notifications-paginate', requireAuth, (req,res) => {
	
		//number of returned notifications;
		//limit and page must be int
		const limit = req.query.limit*1 || 15;
		const page = req.query.page*1 || 1;

		UserModel.findById(req.query.id, (err,user) => {

			if(err || !user) {
				console.log(err);
				return res.status(422).send({error:err});
			}

			NotificationModel.paginate(
				{ _id:{ $in: user.notifications }},
				{ page, limit, sort: { createdAt: -1 }, populate : {path : 'author', options: {lean: true, select: '_id username'}}},
				(err, result) => {
					if(err) {
						console.log(err);
						return res.status(422).send({error:err});
					}
					res.json(result);
			});
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


	router.put('/api/notifications/addSubscription', requireAuth, function(req,res) {

		UserModel.findById(req.user._id)
			.exec(function(err, user) {
				if(err || !user) {
					return res.status(422).send({error:err});
				}

				user.subscriptions.push(req.body);
				user.save(function(err) {
					res.json(req.body);	
				});
							
			});
	});

	router.delete('/api/notifications/deleteSubscription', requireAuth, function(req,res) {

		UserModel.findById(req.user._id)
			.exec(function(err, user) {
				if(err || !user) {
					return res.status(422).send({error:err});
				}
				console.log(req.query);
				console.log(user.subscriptions);
				user.subscriptions.splice(req.query.index, 1);
				user.save(function(err) {
					res.json(user.subscriptions);
				});				
			});
	});
	

	return router;
}