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

module.exports.profile = async function(req, res) {
  try {
      // Retrieve the user's profile based on the id parameter from the request
      const user = await User.findById(req.params.id).exec();
      
      // Render the 'user_profile' template with the user's profile data
      res.render('user_profile', {
          title: 'User Profile',
          profile_user: user
      });
  } catch (err) {
      console.error("Error:", err);
  }
};

module.exports.update = async function (req, res) {
//   try {
//       const user = await User.findById(req.params.id).exec();

//       if (!user) {
//           return res.status(404).send('User not found');
//       }

//       if (user.id === req.user.id) {
//           // Update the user
//           await User.findByIdAndUpdate(req.params.id, req.body).exec();
//           return res.redirect('back');
//       } else {
//           return res.status(401).send('Unauthorized');
//       }
//   } catch (err) {
//       console.error("Error:", err);      
//   }
// };

  if(req.user.id == req.params.id){

    try{

      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err){
        if(err) {console.log('******Multer Error: ', err)}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){
          // this is saving the path of the uploaded file into the avatar filed in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    }
    catch(err){
      req.flash('error', err);
      return res.redirect('back');
    }

  }else{
    req.flash('error', 'Unauthorized');
    return res.status(401).send('Unauthorized');
  }
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
    req.flash('Success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error logging out:", err);
    }
    req.flash('Success', 'You have logged out!!');
    return res.redirect('/');
  });
};