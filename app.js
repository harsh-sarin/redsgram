var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Post           = require("./models/post"),
    Comment        = require("./models/comment"),
    seedDb         = require("./seed");

mongoose.connect("mongodb://localhost:27017/red_gram", {useNewUrlParser: true});
seedDb();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/posts", function (req, res) {
    Post.find({}, function(err, posts){
        if (err) {
            console.log(err);
        } else {
            res.render("posts", {posts: posts});
        }
    });
});

app.get("/posts/new", function (req, res) {
    res.render("new");
});

app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            console.log("Cannot find post by ID: " + err);
        } else {
            res.render("show", {post: foundPost});
        }
    });
});

app.get("/posts/:id/comments/new", function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Error fetching post information.");
        } else {
            res.render("newComment", {post: post});
        }
    });
});

app.post("/posts", function (req, res) {
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var newPost = { name: name, image: image, description: description };
    Post.create(newPost, function(err, newPost){
        if(err) {
            console.log("Error adding post: " + err);
        } else {
            res.redirect("/posts");
        }
    });
});

app.post("/posts/:id/comments", function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Error fetching post information.");
            res.redirect("/posts/" + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log("Erorr adding comment");
                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/posts/" + req.params.id);
                }
            });
        }
    });
});

app.listen(8080, function () {
    console.log("RedGram is listening on 8080.");
})