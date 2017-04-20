import UserModel from '../models/User';
import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
import express from 'express';

module.exports = function(io) {
	const router = express.Router();

	router.get('/api/user',(req,res) => {
		UserModel.findById(req.query.id, {password: 0})
			.populate('posts comments')
				.lean()
				.exec((err, user) => {
			if(err) {
				return res.status(422).send({error:err});
			}
			res.json(user);
		});
	});

	return router;
}




