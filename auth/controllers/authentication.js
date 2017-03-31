const User = require("../../models/user");
const jwt = require("jwt-simple");
const config = require('../../config');
import isEmail from 'validator/lib/isEmail';

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next) {
    //User has already their email and password authd we just need to give them a token
    res.send({ token: tokenForUser(req.user), id: req.user.id});
    console.log(req.user);
}

exports.signup = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    if(!email || !password || !username) {
        return res.status(422).send({error: "You must provide an email ,password and username"});
    }

    if(!isEmail(email)) {
        return res.status(422).send({error: "Invalid email"});
    }
    //see if given user exists
    User.findOne({email: email}, function(err, existingUser){
        if(err) { return next(err); }
        
        //if yes return error
        if(existingUser) {
            return res.status(422).send({error: "Email already in use"});
        }
        
        //if not create and save user record
        const user = new User({
            email: email,
            password: password,
            username: username
        });
        
        user.save(function(err){
            if(err) {return next(err);}
            res.json({
                token: tokenForUser(user),
                id: user.id });
        });
    });
   
    
    
}