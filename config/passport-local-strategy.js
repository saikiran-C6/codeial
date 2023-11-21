const { authenticate } = require('passport');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Authenticating using passport
passport.use(new LocalStrategy(
      
    {
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        
      // find a user and establish the identity
      User.findOne({email: email}, function(err, user) {
          if(err)
          {
              req.flash('error', err);
              return done(err);
          }

          if(!user || user.password != password)
          {
              req.flash('error', 'Invalid Username/Password');
              return done(null, false);
          }
          
          console.log(`${user.name} signed in!`);
          return done(null, user);
      });
    }
));


// serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){

  User.findById(id, function(err, user){

      if(err) { console.log('Error in finding user --> Passport'); return done(err); }

      return done(null, user);
  });
});

// check if the user is authenticated
// Middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
  // If the user is signed in, pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
      return next(); 
  }

  // If the user is not signed in, redirect to the sign-in page
  return res.redirect('/users/sign-in');
}

// Middleware to set the authenticated user in res.locals for views
passport.setAuthenticatedUser = function(req, res, next) {
  if (req.isAuthenticated()) {
      // req.user contains the current signed-in user from the session cookie, and we're sending this to res.locals for views
      res.locals.user = req.user;
  }
  next(); // Call next() to pass control to the next middleware or route
}
  

module.exports = passport;