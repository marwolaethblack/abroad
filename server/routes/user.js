import express from 'express';
import passport from 'passport';
import mkdirp from 'mkdirp';
import multer from 'multer';
import fs from 'fs';

import User from '../db/models/UserNew';
import Post from '../db/models/PostNew';
import Notification from '../db/models/NotificationNew';
import Authentication from '../auth/controllers/authentication';
import countries from '../../constants/countries.js';
import { createFilePath } from '../helpers/fileUpload';
// import UserNew from '../models/UserNew';

// import Notification from '../db/models/NotificationNew';


module.exports = function() {
	const router = express.Router();
	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.get('/api/user', (req, res) => {

		UserNew.findById(
			req.query.id,
			{
				attributes:['id','username','image','about','countryFrom','countryIn'],
				raw: true
		})
		.then(foundUser => {
			if(foundUser){
				res.json(foundUser);
			} else {
				return res.status(404).send({ error: 'User not found.' });
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(422).send({ error:err });
		});
	});

	router.get('/api/socialUser', (req, res) => {

		const userInfo = req.query;

		UserNew.findOne({ 
			where: { 
				socialId: userInfo.id, 
				provider: userInfo.provider 
			},
			attributes: ['id','username'],
			raw: true 
		})
	   .then(foundUser => {
	   		if(foundUser){
	   			res.json({
                    token: Authentication.tokenForUser({ id: foundUser.id }),
                    id: foundUser.id,
                    username: foundUser.username 
                });
	   		} else {
	   			 let newUser = {
		        	socialId: userInfo.id,
		            username: userInfo.name,
		            email: userInfo.email,
		            provider: userInfo.provider,
		        };

		         if(newUser.provider === 'facebook'){
		        	newUser['image'] = 'https://graph.facebook.com/'+req.query.id+'/picture?type=large';

		        	//get a user's country from FB locale - en_US -> <language>_<country>
			        if(userInfo.locale){
			        	const countryCode = userInfo.locale.slice(-2);
			        	newUser.countryFrom = countries.default[countryCode];
			        }
		        }

		        UserNew.create(newUser)
		        .then(createdUser => {

                    const newNotif = {
                        text: "Welcome to Abroad",
                        type: 'administration',
                        ownerId: createdUser.id,
                        authorId: '70fcdf77-0786-46b7-80b8-712d5d5b0945' //this should be ID of admin
                    };

                    Notification.create(newNotif)
                    .then(() => {

                        res.json({
                            token: exports.tokenForUser(createdUser),
                            id: createdUser.id,
                            username: createdUser.username 
                        });

                    })
                    .catch(err => {
                        console.log(err);
						return res.status(422).send({ error:err });
                    });
                 })
		        .catch(err => {
                    console.log(err);
					return res.status(422).send({ error:err });
                });
	   		}
	   })
	   .catch(err => {
	   	return res.status(422).send({ error:err });
	   });

		// UserModel.findOne({ socialId: userInfo.id, provider: userInfo.provider })
		// .lean()
		// .exec(function(err, user) {
		// 	if(err) {
		// 		return res.status(422).send({error:err});
		// 	}

		// 	if(user){			
				// res.json({
    //                     token: Authentication.tokenForUser({ id: user._id }),
    //                     id: user._id,
    //                     username: user.username 
    //             });

		// 	} else {
		        // var user = new UserModel({
		        // 	socialId: userInfo.id,
		        //     username: userInfo.name,
		        //     email: userInfo.email,
		        //     provider: userInfo.provider,
		        //     notifications: []
		        // });

		        // if(userInfo.provider === 'facebook'){
		        // 	user['image'] = 'https://graph.facebook.com/'+req.query.id+'/picture?type=large';
		        // }

		        // //get a user's country from FB locale - en_US -> <language>_<country>
		        // if(userInfo.locale){
		        // 	var country_code = userInfo.locale.slice(-2);
		        // 	user['country_from'] = countries.default[country_code];
		        // }

		//          var newNotif = new NotificationModel({
		//             text: "Welcome to abroad"
		//         });

		//         newNotif.save();
		//         user.notifications.push(newNotif);

		//         user.save(function(err){
  //                   if(err) {res.json(err)}

  //                   res.json({
  //                       token: Authentication.tokenForUser({ id: user._id }),
  //                       id: user._id,
  //                       username: user.username 
  //                  	});
		// 		});
		//     }
		// });
	});

	//EDIT USER

	// configuring Multer to use files directory for storing files
	const storage =   multer.diskStorage({
	  destination: (req, file, callback) => {
	  	const dir = './uploads/userProfiles/' + createFilePath(file.originalname);
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

	router.put('/api/editUser', requireAuth, upload.single('image'), (req, res) => {

		let userInfo = req.body;
		const userId = req.user.id;

		if(Object.keys(userInfo).length){
			if(JSON.stringify(userInfo.id) === JSON.stringify(userId)) {		

				if(req.file){
					//remove 'uploads' from the file destination path
					const cutOff = 'uploads';
					const index = req.file.destination.indexOf(cutOff);
					userInfo.image = req.file.destination.substr(index + cutOff.length) + "/"+req.file.filename;
				}
				
				//update the user
					UserNew.update(
						userInfo,
						{ where: { id: userId } }
					)
					.then(updatedUser => {
						if(updatedUser){
							//if a user changes a profile pic,
							//delete the former one
							if(userInfo.image){
								const imgPath = './uploads'+userInfo.image;
								//check if the image exists
								fs.stat(imgPath, (err, stats) => {
								 	if(stats){
								 		//delete the image
								 		fs.unlink(imgPath, (err) => {
										  if (err) console.log(err);
										});
									 } 
								}); 
							}

							res.json(updatedUser);
						}
					})
					.catch(err => {
						res.status(500).send('Sorry, uploading user went wrong.');
					});
				// UserModel.findOneAndUpdate(
				// 	{ _id: userId },
				// 	userInfo
				// )
				// .exec(function(err,oldUserData) {
				// 		if(err) console.log(err);

					// if a user changes a profile pic,
					// delete the former one
				// 	if(oldUserData.image){
				// 		 //delete an image of the deleted post from the file system
						 // const imgPath = './uploads'+oldUserData.image;
						 // //check if the image exists
						 // fs.stat(imgPath, (err,stats) => {
						 // 	if(stats){
						 // 		//delete the image
						 // 		fs.unlink(imgPath, (err) => {
							// 	  if (err) console.log(err);
							// 	});
							//  } 
						 // }); 
				// 	}

				// 	res.json(oldUserData);
				// });
			} else {
				return res.status(401).send({error:"Unauthorized"});
			}
		} else {
			return res.status(422).send({error:"Wuut? User profile is WRONG!."});
		}
	});

	return router;
}