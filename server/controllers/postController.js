import { Post, Comment, User } from '../db/models';


exports.getPostById = (req, res) => {

	const roomId = req.query.id;
	postSocket.once('connection', (socket) => {
		socket.join(roomId);
	});

	Post
	.findById(req.query.id, { raw: true })
	.then(foundPost => {
		if(foundPost){
			User
			.findById(
				foundPost.authorId, 
				{ 
					raw:true, 
					attributes: ['id','username','image','countryFrom','countryIn'] 
				}
			)
			.then(foundUser => {
				if(foundUser){
					
					foundPost.author = foundUser;

					Comment
					.findAll({
						where: { postId: foundPost.id }
					})
					.then(foundComments => {
						foundPost.comments = foundComments || [];
						res.json(foundPost);
					})
					.catch(err => {
						res.status(500).send({error: err+": Couldn't fetch post's comments "})
					});

				} else {
					res.status(404).send({ error:'User not found.' });
				}
			})
			.catch(err => {
				res.status(500).send({error:err+':find user by id error'});
			});
		} else {
			res.status(404).send({error:'Post not found.'});
		}
	})
	.catch(err => {
		res.status(500).send({error:err+':find post by id error'});
	});
}