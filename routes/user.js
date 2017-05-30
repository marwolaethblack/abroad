var UserModel = require('../models/User');
var NotificationModel = require('../models/Notification');
var express = require('express');
var passport = require('passport');
var Authentication = require('../auth/controllers/authentication');
var countries = require('../client/src/constants/countries');
import { createFilePath } from '../services/fileUpload';
import mkdirp from 'mkdirp';
import multer from 'multer';
import fs from 'fs';


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
				res.json({
                        token: Authentication.tokenForUser({ id: user._id }),
                        id: user._id,
                        username: user.username 
                });

			} else {
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

	//EDIT USER

	// configuring Multer to use files directory for storing files
	const storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
	  	const dir = './uploads/userProfiles/'+createFilePath(file.originalname);
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

	router.put('/api/editUser', requireAuth, upload.single('image'), function(req,res) {

		let userInfo = req.body;
		const userId = req.user._id;

		if(Object.keys(userInfo).length){
			if(JSON.stringify(userInfo._id) === JSON.stringify(userId)) {		

				if(req.file){
					//remove 'uploads' from the file destination path
					const cutOff = 'uploads';
					const index = req.file.destination.indexOf(cutOff);
					userInfo.image = req.file.destination.substr(index + cutOff.length) + "/"+req.file.filename;
				}
				
				//update the user
				UserModel.findOneAndUpdate(
					{ _id: userId },
					userInfo
				)
				.exec(function(err,oldUserData) {
						if(err) console.log(err);

					//if a user changes a profile pic,
					//delete the former one
					if(oldUserData.image){
						 //delete an image of the deleted post from the file system
						 const imgPath = './uploads'+oldUserData.image;
						 //check if the image exists
						 fs.stat(imgPath, (err,stats) => {
						 	if(stats){
						 		//delete the image
						 		fs.unlink(imgPath, (err) => {
								  if (err) console.log(err);
								});
							 } 
						 }); 
					}

					res.json(oldUserData);
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