"use strict";
var express = require('express');
var router = express.Router();
var blog = require('./actions');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/blog/', blog.index);
router.post('/blog/', blog.create );
router.get('/blog/new', blog.new_);
router.get('/blog/:id/edit', blog.edit);
router.put('/blog/:id', blog.update);
router.get('/blog/:id', blog.show);

module.exports = router;
