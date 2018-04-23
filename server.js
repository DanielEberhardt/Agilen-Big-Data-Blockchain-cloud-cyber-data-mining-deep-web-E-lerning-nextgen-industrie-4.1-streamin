// server.js
// load the things we need
var express = require('express');
var app = express();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var articles = [];
var datenbank;

MongoClient.connect("mongodb://localhost:27017/webshop", function(err, db) {
	if(err) throw err;
	datenbank = db;
	console.log("MongoDB connected!");
});


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	var dbo = datenbank.db("webshop");
	dbo.collection("artikel").find({}).toArray(function(err, result) {
		if(err) throw err;
		result.forEach(function(article) {
			articles.push({name: article.name, beschreibung: article.beschreibung, bildurl: article.bildurl});
		});
		console.log(articles);
		
		res.render('pages/index', {
		articles: articles});
	});
	
	articles = [];
	console.log("a");
});

app.get("/submit", (req, res) => {
	var dbo = datenbank.db("webshop");
	var senddata = {date: req.query.date, article: req.query.name};
	dbo.collection("bestellungen").insertOne(senddata, function (err, res) {
		if (err) throw err;
		console.log("Eine Bestellung hinzugefügt!");
	});
	res.send(req.query.name);
	
	request.post('https://mhasler.eu/delivery.php?group_id=B&article_id=' + req.query.name + '&version=1');
});



app.listen(8080);
console.log("Server started!");



