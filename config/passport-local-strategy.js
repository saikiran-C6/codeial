const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Authenticating using passport
passport.use(new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email }).exec();
  
        if (!user || user.password !== password) {
          console.log('Invalid Username/Password');
          return done(null, false);
        }
  
        return done(null, user);
      } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
      }
    }
  ));

// serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id).exec();
      if (!user) {
        console.log('User not found');
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      console.log('Error in finding user --> Passport');
      return done(err);
    }
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