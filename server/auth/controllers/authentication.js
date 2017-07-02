import jwt from "jwt-simple";
import bcrypt from "bcrypt-nodejs";
import isEmail from 'validator/lib/isEmail';

import config from '../../config';
import { User, Notification } from '../../db/models';


export const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


export const signIn = (req, res, next) => {
    //User has already their email and password auth we just need to give them a token
    res.send({ 
       token: exports.tokenForUser(req.user),
       id: req.user.id,
       username: req.user.username, 
       // subscriptions: req.user.subscriptions
    });
}

export const signUp = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if(!email || !password || !username) {
        return res.status(422).send({error: "You must provide an email, password and username"});
    }

    if(!isEmail(email)) {
        return res.status(422).send({error: "Invalid email"});
    }

    //see if a given user with email exists
    User
    .findOne({
      where: { email },
      attributes: ['id'],
      raw: true
    })
    .then(existingUser => {
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

                User
                .create(newUser)
                .then(createdUser => {

                    const newNotif = {
                        content: "Welcome to Abroad",
                        ownerId: createdUser.id,
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
                })
                .catch(err => {
                    return next(err);
                });;
            });
        });
    });
}