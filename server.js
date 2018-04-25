// server.js
// load the things we need
var express = require('express');
var app = express();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var articles = [];
var datenbank;

var fs = require('fs');
var config = fs.readFileSync("config.json");
var configContent = JSON.parse(config);


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

app.get("/add", (req, res) => {
	res.render('pages/add');
});

app.get("/addarticle", (req, res) => {
	var dbo = datenbank.db("webshop");
	var senddata = {name: req.query.name, beschreibung: req.query.beschreibung, bildurl: req.query.bildurl};
	dbo.collection("artikel").insertOne(senddata, function (err, res) {
		if (err) throw err;
		console.log("Einen Artikel hinzugefügt!");
	});
	res.send("Artikel hinzugefügt");
});

var stdin = process.openStdin();

 process.stdin.resume();
 var util = require('util');

  process.stdin.on('data', function (text) {
    var input = text.toString().trim();
	
	if(input == "quit" || input == "close" || input == "exit") {
		server.close();
		console.log("Server gestoppt!");
		process.exit();
	}
  });

  function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
  }
var server = app.listen(configContent.port);
console.log("Server started!");



