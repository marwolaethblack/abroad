const Authentication = require("../auth/controllers/authentication");
const passportService = require("../auth/services/passport");
const passport = require("passport");
const express = require('express');
const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false }); //Route middleware for authentication
const requireSignin = passport.authenticate('local', { session: false });

router.get('/', requireAuth, function(req, res) {
    res.send({message: 'Super secret code is ABC123'});
});
router.post('/signin', requireSignin, Authentication.signin);
router.post("/signup", Authentication.signup);

export default router;