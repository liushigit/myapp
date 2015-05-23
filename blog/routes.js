"use strict";
var express = require('express');
var router = express.Router();
var blog = require('./actions');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Faculty' });
});

router.get('/blog/new', blog.new);
router.post('/u/:user/blog/', blog.create );
router.get('/u/:user/blog/', blog.index);
router.get('/u/:user/blog/:id/edit', blog.edit);
router.put('/u/:user/blog/:id', blog.update);
router.get('/u/:user/blog/:id', blog.show);
router.delete('/u/:user/blog/:id', blog.trash);
router.get('/u/:user/tags/', blog.userTags);



module.exports = router;
