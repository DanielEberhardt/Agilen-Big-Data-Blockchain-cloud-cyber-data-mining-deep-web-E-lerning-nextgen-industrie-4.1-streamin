var request = require("request");
var expect  = require("chai").expect;
var mongo = require('mocha-mongo')('mongodb://localhost:27017/webshop');
describe("Shop Test", function() {

  describe("Website Test", function() {
    var url = "http://localhost:8080/";
    it("returns status 200", function() {
	request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });	
    });
 
  });
  describe("Database Test", function() {
		var ready = mongo.ready();
	it('using the db', ready(function(db, done) {
	
	db.collection('test').insert({test: 'TestCase'}, done);
	}));
  });
});
