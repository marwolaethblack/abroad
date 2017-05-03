import UserModel from '../models/User';
import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
import express from 'express';
import passport from 'passport';

module.exports = function(notificationSocket) {
	const router = express.Router();
	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication

	router.get('/api/user', (req,res) => {
		UserModel.findById(req.query.id, {password: 0})
			// .populate('posts comments')
				.lean()
				.exec((err, user) => {
			if(err) {
				return res.status(422).send({error:err});
			}
			res.json(user);
		});
	});

	router.put('/api/editUser', requireAuth, (req,res) => {

		let { userInfo } = req.body;
		const { _id } = req.user;

		if(Object.keys(userInfo.editedFields).length){
			if(JSON.stringify(userInfo.userId) === JSON.stringify(_id)) {		
				
				//update a post and return the edited post
				UserModel.findOneAndUpdate(
					{ _id: userInfo.userId },
					{...userInfo.editedFields}, 
					{new: true}
				)
				// .populate("comments")
				.exec((err,editedUser) => {
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



	router.get('/api/user/notifications', (req,res) => {
		UserModel.findById(req.query.id)
			    .populate({path: 'notifications', options: {limit: 20, lean: true, sort:{'createdAt': -1}}})
				.exec((err, user) => {
			if(err) {
				console.log(err);
				return res.status(422).send({error:err});
			}
			res.json(user.notifications);

		});
	});

	return router;
}




