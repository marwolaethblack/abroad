// var UserModel = require('../models/User');
// var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');

import User from '../models/UserNew';
import Notification from '../models/NotificationNew';


module.exports = (notificationSocket) => {

	const router = express.Router();
	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	//LATEST NOTIFICATIONS
	router.get('/api/notifications-latest', requireAuth, (req, res) => {
		
		//number of returned notifications;
		const limit = req.query.limit || 5;

		Notification.findAll({ 
			where: { ownerId: req.query.id }, 
			limit 
		})
		.then(notifications => {
			res.json(notifications);
		})
		.catch(err => {
			return res.status(422).send({ error:err });
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
	router.put('/api/notifications/seen', requireAuth, (req, res) => {

		Notification.update(
			{ seen: true }, 
			{ where: { ownerId: req.body.userId } }
		)
		.then(() => {
			res.status(200);
		})
		.catch(err => {
			return res.status(422).send({error:err});
		});

		// UserModel.findById(req.body.userId)
		// 	.lean()
		// 	.exec(function(err, user) {
		// 		if(err || !user) {
		// 			return res.status(422).send({error:err});
		// 		}

		// 		NotificationModel.update(
		// 		 { "_id": { $in: user.notifications }},
		// 		 {"$set": { "seen":true }},
		// 		 {"multi": true}, //for multiple documents
		// 		 function(err){
		// 		 	if(err) return console.error(err);   
		// 		 }
		// 		)
		// 	});
	});


	router.put('/api/notifications/addSubscription', requireAuth, (req, res) => {

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

	router.delete('/api/notifications/deleteSubscription', requireAuth, (req, res) => {

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