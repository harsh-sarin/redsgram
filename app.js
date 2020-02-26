var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Post           = require("./models/post"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDb         = require("./seed");

mongoose.connect("mongodb://localhost:27017/red_gram", {useNewUrlParser: true});
seedDb();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "", //Normally I wouldn't upload the secret to GitHub.
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("index");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.get("/posts", isLoggedIn, function (req, res) {
    Post.find({}, function(err, posts){
        if (err) {
            console.log(err);
        } else {
            res.render("posts", {posts: posts});
        }
    });
});

app.get("/posts/new", isLoggedIn, function (req, res) {
    res.render("new");
});

app.get("/posts/:id", isLoggedIn, function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            console.log("Cannot find post by ID: " + err);
        } else {
            res.render("show", {post: foundPost});
        }
    });
});

app.get("/posts/:id/comments/new", isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Error fetching post information.");
        } else {
            res.render("newComment", {post: post});
        }
    });
});

app.post("/posts", isLoggedIn, function (req, res) {
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

app.post("/posts/:id/comments", isLoggedIn, function(req, res){
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

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log("Error registering new user");
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.render("posts");
            });
        }
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.listen(8080, function () {
    console.log("RedsGram is listening on 8080.");
})