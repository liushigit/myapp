// var should = require("should");
var request = require('supertest');
var app = require('../app');
var BlogEntry = require('../blog/models').BlogEntry;


describe('GET /blog/', function() {
    var agent = request.agent(app);

    it('should login', function(done) {
        agent
            .post('/login')
            .send({u: 'liushi', pw: '123456'})
            .expect(302, done);
    });

    it('blog list', function(done) {
        agent
            .get('/blog/')
            .expect(200, done);
    });

    it('post a new blog entry', function(done){
        agent
            .post('/blog/')
            .send({blog: {title:'Cool', body:'Cool Text'}})
            .expect(302)
            .end(function(err) {
                if (err) {
                    console.log(err);
                }
                BlogEntry.remove({title: 'Cool'}, function(err) {

                });
                done();
            });
    }); 
});

var entry;
BlogEntry.find({}, function(err, docs) {
    entry = docs[1];
});

describe('GET /blog/:id/edit', function() {
    it('blog entry edit form page', function(done) {
        request(app)
            .get('/blog/' + entry.id + '/edit')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    // console.log(err);
                    throw err;
                }
                done();
            });
    });
});

