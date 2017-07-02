import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

import config from "../../config";
import { User } from '../../db/models';


//Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
   //Verify this email and password call done with user
   //if it is correct email and password
   //otherwise call done with false
  User
  .findOne({ 
    where: { email }, 
    attributes: ['id', 'email', 'password', 'username']
  })
  .then(foundUser => {

    if(!foundUser) { 
      return done(null, false); 
    }  
    //compare passwords is password equal to user.password ?
    foundUser.comparePassword(password, (err, isMatch) => {
      if(err) { 
        console.log(err); 
        return done(err); 
      } else if(!isMatch) {
          return done(null, false);
      } else {
          return done(null, foundUser);
      }
    });
  });
});

//Setup options for passport strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create jwt strategy
const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  //See if the user id in the payload exists in our database
  User
  .findById(payload.sub)
  .then(foundUser => {

    if(foundUser) {
      //If it does call done with the user object
      done(null, foundUser);
    } else {
      //if not call done with false
      done(null, false);
    }
  })
  .catch(err => {
    return done(err, false);
  });
});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);