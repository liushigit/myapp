var request = require('supertest');
var app = require('../app');

describe('GET /login', function() {
    it('gets login page', function(done) {
        request(app)
            .get('/login')
            .expect(200, done);
    });
});

describe('POST to /login', function() {
    it('logs in', function(done){
        request(app)
            .post('/login')
            .send({u:'liushi', pw:'123456'})
            .expect(200)
            .end(function(err) {
                if (err) {
                    console.log(err);
                }
                done();
            });
    }); 
});