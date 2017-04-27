const passport = require("passport");
const User = require("../../models/User");
const config = require("../../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
   //Verify this email and password call done with user
   //if it is correct email and password
   //otherwise call done with false
   User.findOne({email:email}, function(err, user) {
       if(err) { return done(err); }
       if(!user) { return done(null, false); }
       
       //compare passwords is password equal to user.password ?
       user.comparePassword(password, function(err, isMatch) {
          if(err) { console.log(err);return done(err); }
          
          if(!isMatch) {return done(null, false); }
          if(isMatch) {
              return done(null, user);
          }
       });
       
   })
});

//Setup options for passport strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
   //See if the user id in the payload exists in our database
   User.findById(payload.sub, function(err, user) {
      if(err) { return done(err, false); }
      
      if(user) {
          //If it does call done with the user object
          done(null, user);
      } else {
          //if not call done with false
          done(null, false);
      }
   });
});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);