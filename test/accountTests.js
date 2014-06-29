"use strict";

var request = require('supertest');
var app = require('../app');

describe('GET /login', function () {
    it('gets login page', function (done) {
        request(app)
            .get('/login')
            .expect(200, done);
    });
});

describe('POST to /login', function () {
    it('logs in succesfully', function (done) {
        request(app)
            .post('/login')
            .send({u: 'testuser', pw: '123456'})
            .expect(302)
            .expect('location', '/blog/')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    }); 
});
