const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
      let post =  await Post.create({
        content: req.body.content,
        user: req.user._id
      });

      if(req.xhr){
        return res.status(200).json({
          data: {
            post: post
          },
          message: "Post created!"
        })
      }


      req.flash('success', 'Posted Successfully');
      return res.redirect('back');
    
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
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
        post.deleteOne(); 
       
        await Comment.deleteMany({ post: req.params.id });

        if(req.xhr){
          return res.status(200).json({
            data: {
              post_id: req.params.id
            },
            message: 'Post deleted'
          })
        }

        req.flash('success', 'Post and associated comments deleted');

        return res.redirect('back');
    } else {
        req.flash('error', 'You cannot delete this post!');
        return res.redirect('back');
    }

} catch (err) {
    req.flash('error', err);
    return res.redirect('back');    
}
};

