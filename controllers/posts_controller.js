const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
      const post = await Post.create({
        content: req.body.content,
        user: req.user._id
      });
  
      return res.redirect('back');
    } catch (err) {
      console.log('error in creating a post', err);
      // return res.status(500).send('Error in creating a post');
    }
}

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.redirect('back');
    }

    // Check if the user is the owner of the post
    if (post.user == req.user.id) {
        await post.deleteOne(); 
       
        await Comment.deleteMany({ post: req.params.id });

        return res.redirect('back');
    } else {
        return res.redirect('back');
    }
} catch (err) {
    console.error('Error in destroying post:', err);    
}
};

