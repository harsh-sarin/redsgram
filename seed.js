var mongoose = require("mongoose"),
    Post     = require("./models/post"),
    Comment  = require("./models/comment");

var data = [
    { name: "Champions League", image: "/images/europe.jpg", description: "Champions of Europe"},
    { name: "Club World Cup", image: "/images/europe.jpg", description: "Champions of the World"},
    { name: "UEFA Super Cup", image: "/images/europe.jpg", description: "Adriaaaaaan!!!"}
]

function addDataToDb() {
    data.forEach(function(seed) {
        Post.create(seed, function(err, post) {
            if (err) {
                console.log("Error adding data");
            } else {
                console.log("Successfully created post");
                Comment.create({
                    text: "Weee are the champioons",
                    author: "SteveG"
                }, function(err, comment){
                    if (err) {
                        console.log(err);
                    } else {
                        post.comments.push(comment);
                        post.save();
                        console.log("Created new comment");
                    }
                });
            }
        });
    });
}

function removeComment() {
    Comment.remove({}, function(err){
        if (err) {
            console.log("Error cleaning database - cannot delete Comments.");
        } else {
            addDataToDb();
        }
    });
}

function manageCleanupAndSeeding() {
    Post.remove({}, function(err){
        if (err) {
            console.log("Error cleaning database - cannot delete Posts.");
        } else {
            removeComment();
        }
    });
}

function seedDb() {
    manageCleanupAndSeeding();
}

module.exports = seedDb;