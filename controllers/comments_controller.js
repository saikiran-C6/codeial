const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

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

            comment = await comment.populate('user', 'name email').execPopulate();
            // commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('Error in sending to the queue', err);
                    return;
                }

                console.log('job enqueued', job.id);
            });

            if(req.xhr){

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created"
                });
            }

            req.flash('success', 'Comment published');
            

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

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            
            // send the comment id which was deleted back to the views
            // if(req.xhr){
            //     return res.status(200).json({
            //         data: {
            //             comment_id: req.params.id
            //         },
            //         message: "Post deleted"
            //     });
            // }
            // req.flash('success', 'Comment deleted');

            return res.redirect('back');
        } else {
            // req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in destroying comment:', err);        
    }
};