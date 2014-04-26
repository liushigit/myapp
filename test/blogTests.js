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

describe('POST /blog/', function() {
    it('post a new blog entry', function(done){
    	request(app)
			.post('/blog/')
			.send({blog: {title:'Cool', body:'Cool Text'}})
		    .expect(302)
			.end(function(err) {
				if (err) {
					console.log(err);
				}
				done();
			});
    }); 
});

var entry;
BlogEntry.find({}, function(err, docs) {
    entry = docs[1];
});

describe('GET /blog/', function() {
	
    it('blog entry edit form page', function(done) {
        request(app)
            .get('/blog/' + entry.id + '/edit')
            .expect(200)
			.end(function(err, res) {
				if (err) {
					console.log(err);
					throw err;
				}
				done();
			});
    });
});

