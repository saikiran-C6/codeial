const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {
    try {
        // Populate the user of each post
        const posts = await Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .exec();

        // Query all users using async/await
        const users = await User.find({}).exec();

        // Render the 'home' template with posts and all_users data
        res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.error("Error:", err);
    }
};

// module.exports.actionName = function(req, res){}
