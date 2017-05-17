var User = require("../../models/User");
var NotificationModel = require("../../models/Notification");
var jwt = require("jwt-simple");
var config = require('../../config');
var bcrypt = require("bcrypt-nodejs");
import isEmail from 'validator/lib/isEmail';

exports.tokenForUser = function(user) {
    var timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}


exports.signin = function(req, res, next) {
    //User has already their email and password authd we just need to give them a token
    res.send({ token: tokenForUser(req.user), id: req.user.id, username:req.user.username});
}

exports.signup = function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    if(!email || !password || !username) {
        return res.status(422).send({error: "You must provide an email ,password and username"});
    }

    if(!isEmail(email)) {
        return res.status(422).send({error: "Invalid email"});
    }
    //see if given user with email or username exists
    User.findOne({'email': email}).lean().exec(function(err, existingUser){
        if(err) { return next(err); }
        
        //if yes return error
        if(existingUser) {
            return res.status(422).send({error: "Email already in use"});
        }
        
        //if not create and save user record
        var user = new User({
            email: email,
            password: password,
            username: username,
            notifications: []
        });

        var newNotif = new NotificationModel({
            text: "Welcome to abroad"
        });
        newNotif.save();
        user.notifications.push(newNotif);

        //generate salt
        bcrypt.genSalt(10, function(err, salt) {
        if(err) {return next(err); }
        
            //hash our password using salt
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if(err) {return next(err);}
                
                //overwrite plaintext password with encrypted password
                user.password = hash;

                 user.save(function(err){
                    if(err) {return next(err);}
                    res.json({
                        token: tokenForUser(user),
                        id: user._id,
                        username: user.username });
                    });
                    
                });
        });   
    
    });
}