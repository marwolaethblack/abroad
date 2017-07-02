const Authentication = require("../auth/controllers/authentication");
const passportService = require("../auth/services/passport");
const passport = require("passport");
const express = require('express');



module.exports = function (notifSocket) {

	const router = express.Router();

	const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication
	const requireSignin = passport.authenticate('local', { session: false });

	router.post('/api/signin', requireSignin, Authentication.signin);
	router.post('/api/signup', Authentication.signup);
	

	return router;
}


