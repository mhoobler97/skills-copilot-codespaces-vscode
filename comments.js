//create web server
var express = require("express");
var app = express();
//create server
var server = require("http").createServer(app);
//create socket connection
var io = require("socket.io").listen(server);
//create port
var port = process.env.PORT || 3000;
//server listen to port
server.listen(port, function() {
    console.log("Server listening on port " + port);
});

//create array of comments
var comments = [];
//create array of users
var users = [];

//create route to index.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//create connection event
io.sockets.on("connection", function(socket) {
    //create event to add user
    socket.on("add user", function(username) {
        socket.username = username;
        users.push(socket.username);
        updateUsernames();
    });

    //create event to update usernames
    function updateUsernames() {
        io.sockets.emit("get users", users);
    }

    //create event to add comment
    socket.on("add comment", function(comment) {
        comments.push(comment);
        io.sockets.emit("get comments", comments);
    });

    //create event to remove comment
    socket.on("remove comment", function(index) {
        comments.splice(index, 1);
        io.sockets.emit("get comments", comments);
    });

    //create event to update comment
    socket.on("update comment", function(data) {
        comments[data.index] = data.comment;
        io.sockets.emit("get comments", comments);
    });

    //create event to disconnect
    socket.on("disconnect", function() {
        if (!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
    });
});