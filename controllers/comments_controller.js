const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post).exec();

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            return res.redirect('/');
        } else {            
            return res.status(404).json({ error: "Post not found" });
        }
    } catch (err) {
        console.error("Error:", err);       
    }
};

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.redirect('back');
        }

        if (comment.user == req.user.id) {
            const postId = comment.post;
            await comment.deleteOne(); 

            // Use $pull to remove the comment from the post's "comments" array
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in destroying comment:', err);        
    }
};