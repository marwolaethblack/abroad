import passport from 'passport';
import express from 'express';

import { signIn, signUp } from '../auth/controllers/authentication';
import passportService from '../auth/services/passport';


module.exports = function (notifSocket) {

	const router = express.Router();

	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication
	const requireSignin = passport.authenticate('local', { session: false });

	router.post('/api/signin', requireSignin, signIn);
	router.post('/api/signup', signUp);
	
	return router;
}


