var express = require('express');
var app = express();

app.use(express.static("public"));

app.get("/index", function(req, res, next){
	res.sendFile(__dirname + "/public/")
});

