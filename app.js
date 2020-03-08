var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    seedDb         = require("./seed");

var commentRoutes = require("./routes/comments"),
    postsRoutes   = require("./routes/posts"),
    indexRoutes   = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/red_gram", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
//seedDb();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
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

app.use("/posts/:id/comments", commentRoutes);
app.use("/posts", postsRoutes);
app.use(indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080, function () {
    console.log("RedsGram is listening on 8080.");
})