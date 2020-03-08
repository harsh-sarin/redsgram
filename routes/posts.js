var express = require("express"),
    router  = express.Router(),
    Post    = require("../models/post"),
    MiddlewareObj = require("../middleware");

router.get("/", MiddlewareObj.isLoggedIn, function (req, res) {
    Post.find({}, function(err, posts){
        if (err) {
            console.log(err);
        } else {
            res.render("posts", {posts: posts});
        }
    });
});

router.post("/", MiddlewareObj.isLoggedIn, function (req, res) {
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = { name: name, image: image, description: description, author: author };
    Post.create(newPost, function(err, newPost){
        if(err) {
            console.log("Error adding post: " + err);
        } else {
            res.redirect("/posts");
        }
    });
});

router.get("/new", MiddlewareObj.isLoggedIn, function (req, res) {
    res.render("new");
});

router.get("/:id", MiddlewareObj.isLoggedIn, function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            console.log("Cannot find post by ID: " + err);
        } else {
            res.render("show", {post: foundPost});
        }
    });
});

router.get("/:id/edit", MiddlewareObj.validatePostOwnership, function (req, res) {
    Post.findById(req.params.id, function(err, userPost){
        res.render("postEdit", {post: userPost});
    });
});

router.put("/:id", MiddlewareObj.validatePostOwnership, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err) {
            console.log("Error updating post");
            res.render("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/:id", MiddlewareObj.validatePostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error deleting post");
        }
        res.redirect("/posts");
    });
});

module.exports = router;