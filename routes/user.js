var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');
var Authentication = require('../auth/controllers/authentication');
var countries = require('../client/src/constants/countries');


module.exports = function() {
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

	router.get('/api/socialUser', function(req,res) {

		var userInfo = req.query;

		UserModel.findOne({socialId: userInfo.id, provider: userInfo.provider})
		.lean()
		.exec(function(err, user) {
			if(err) {
				return res.status(422).send({error:err});
			}

			if(user){			
				// console.log("TOTO JE POSLANE: ");
				// console.log({...user,token: Authentication.tokenForUser({ id: user._id })});
				res.json({
                        token: Authentication.tokenForUser({ id: user._id }),
                        id: user._id,
                        username: user.username 
                });
				// res.json({user,token: Authentication.tokenForUser({ id: user._id })});
			} else {
				// console.log("==========================================");
				// console.log("==========================================");
				// console.log("==========================================");


				// console.log("REQ.query: ");
				// console.log(userInfo);

		        var user = new UserModel({
		        	socialId: userInfo.id,
		            username: userInfo.name,
		            email: userInfo.email,
		            provider: userInfo.provider,
		            notifications: []
		        });

		        if(userInfo.provider === 'facebook'){
		        	user['image'] = 'https://graph.facebook.com/'+req.query.id+'/picture?type=large';
		        }

		        //get a user's country from FB locale - en_US -> <language>_<country>
		        if(userInfo.locale){
		        	var country_code = userInfo.locale.slice(-2);
		        	user['country_from'] = countries.default[country_code];
		        }

		         var newNotif = new NotificationModel({
		            text: "Welcome to abroad"
		        });

		        newNotif.save();
		        user.notifications.push(newNotif);

		        user.save(function(err){
                    if(err) {res.json(err)}

                    res.json({
                        token: Authentication.tokenForUser({ id: user._id }),
                        id: user._id,
                        username: user.username 
                   	});
				});
		    }
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


	return router;
}