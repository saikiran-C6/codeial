const Post = require('../models/post');


module.exports.home = async function(req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    try {
        // const posts = await Post.find({}).exec();
            
        //     return res.render('home', {
        //         title: "Codeial | Home",
        //         posts: posts

        // populate the user of each post
        const posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec();
        
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        console.error("Error:", err);
    }
};

// module.exports.actionName = function(req, res){}
