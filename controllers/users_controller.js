const User = require('../models/user');


// module.exports.profile = async function (req, res) {
//   try {
//     if (req.cookies.user_id) {
//       const user = await User.findById(req.cookies.user_id).exec();
//       if (user) {
//         return res.render('user_profile', {
//           title: "User Profile",
//           user: user
//         });
//       }
//     }
//     return res.redirect('/users/sign-in');
//   } catch (err) {   
//     console.error(err);
//     return res.redirect('/users/sign-in');
//   }
// };

module.exports.profile = function(req, res){
  return res.render('user_profile',{
    title: 'User Profile'
  })
}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }  
  
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
      })
}

// render the sign in page
module.exports.signIn = function(req, res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }    
  
  return res.render('user_sign_in', {
    title: "Codeial | Sign In"
    
    })
}

// get the sign up data
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect('back');
    }
  
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        const newUser = await User.create(req.body);
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.error('Error in signing up:', err);      
      return res.status(500).send('Error in signing up');
    }
  };

// sign in and create the session
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error logging out:", err);
    }
    return res.redirect('/');
  });
};