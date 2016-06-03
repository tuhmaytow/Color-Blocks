var express = require('express');
var app = express();

const PORT = process.env["PORT"];
const SERVER_NAME = "GAME";

app.use('/public', express.static("public"));

app.get('/', function(req, res, next){
	res.sendFile(__dirname + "/views/index.html")
});



app.listen(PORT);