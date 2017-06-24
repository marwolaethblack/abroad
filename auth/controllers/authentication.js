// var User = require("../../models/User");
// var NotificationModel = require("../../models/Notification");
var jwt = require("jwt-simple");
var config = require('../../config');
var bcrypt = require("bcrypt-nodejs");
import isEmail from 'validator/lib/isEmail';
import UserNew from '../../models/UserNew';
import Notification from '../../models/NotificationNew';

exports.tokenForUser = (user) => {
    var timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}


exports.signin = (req, res, next) => {
    //User has already their email and password auth we just need to give them a token

    res.send({ 
       token: exports.tokenForUser(req.user),
       id: req.user.id,
       username: req.user.username, 
       // subscriptions: req.user.subscriptions
    });
}

exports.signup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if(!email || !password || !username) {
        return res.status(422).send({error: "You must provide an email, password and username"});
    }

    if(!isEmail(email)) {
        return res.status(422).send({error: "Invalid email"});
    }

    //see if given user with email exists
    UserNew.findOne({
      where: { email },
      attributes: ['id'],
      raw: true
    }).then(existingUser => {
        //if yes return error
        if(existingUser){
            return res.status(422).send({error: "Email already in use"});
        }

        //if not create and save user record
        let newUser = { email, username };

        //generate salt
        bcrypt.genSalt(10, (err, salt) => {
        if(err) { return next(err); }
        
            //hash a password using salt
            bcrypt.hash(password, salt, null, (err, hash) => {
                if(err) { return next(err); }
                
                //overwrite plaintext password with encrypted password
                newUser.password = hash;

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

                    }).catch(err => {
                        return next(err);
                    });
                });
            });
        }).catch(err => {
            return next(err);
        });
    });
}