// var should = require("should");
var request = require('supertest');
var app = require('../app');
var BlogEntry = require('../blog/models').BlogEntry;

describe('GET /blog/', function() {
    it('blog list', function(done) {
        request(app)
            .get('/blog/')
            .expect(200, done);
    });
});

var entry;
BlogEntry.find({}, function(err, docs) {
    entry = docs[1];
});

describe('GET /blog/', function() {
    it('blog list', function(done) {
        request(app)
            .get('/blog/' + entry.id + '/edit')
            .expect(200, done);
    });
});