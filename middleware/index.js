var Post    = require("../models/post"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

middlewareObj.validateCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                console.log("Error finding comment with ID: " + req.params.comment_id);
                res.render("redirect");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.validatePostOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, userPost){
            if(err) {
                console.log("Error finding campground with ID: " + req.params.id);
                res.render("redirect");
            } else {
                if(userPost.author.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;