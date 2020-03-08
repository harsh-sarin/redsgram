var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Post    = require("../models/post"),
    Comment = require("../models/comment"),
    MiddlewareObj = require("../middleware");

router.get("/new", MiddlewareObj.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Error fetching post information.");
        } else {
            res.render("newComment", {post: post});
        }
    });
});

router.post("/", MiddlewareObj.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Error fetching post information.");
            res.redirect("/posts/" + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log("Erorr adding comment");
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/posts/" + req.params.id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", MiddlewareObj.validateCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("commentEdit", {post_id:req.params.id, comment:foundComment});
        }
    });
});

router.put("/:comment_id", MiddlewareObj.validateCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) { 
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", MiddlewareObj.validateCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        res.redirect("/posts/" + req.params.id);
    });
});

module.exports = router;