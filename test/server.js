var request = require("request");
var expect = require("chai").expect;
var assert = require('chai').assert;
var mongo = require('mocha-mongo')('mongodb://localhost:27017/webshop');
var drop = mongo.drop();
var ready = mongo.ready();
var fs = require('fs');
var config = fs.readFileSync("config.json");
var configContent = JSON.parse(config);


describe("Shop Test", function (done) {
    before(ready(function (db, done) {
        db.collection("test").deleteMany({}, (err) => console.log(err));
        done();
    }));
    describe("Website Test", function () {
        var url = "http://localhost:"+configContent.port;
        it("returns status 200", function () {
            request(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
    describe("Database Write Test", function () {
        var ready = mongo.ready();
        it('using the db', ready(function (db, done) {

            db.collection('test').insert({
                test: 'TestCase'
            }, done);
        }));
    });

    describe("Database Read Test", function () {
        var ready = mongo.ready();
        it('read from db', ready(function (db, done) {
            db.collection("test").find({}).toArray(function (err, result) {
                try {
                    assert.equal("TestCase", result[0].test);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        }));
    });
});
