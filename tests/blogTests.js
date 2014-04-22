// var should = require("should");
var request = require('supertest');
var app = require('../app');

describe('GET /blog/', function() {
    it('blog list', function(done) {
        request(app)
            .get('/blog/')
            .expect(200, done);
    });
});