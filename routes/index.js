var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport");

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log("Error registering new user");
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/posts");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;