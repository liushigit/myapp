var express = require('express');
var router = express.Router();
var blog = require('./controller');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/blog', blog.index);
router.post('/blog', blog.save_new );
router.get('/blog/new', blog.create);
router.get('/blog/:id/edit', blog.edit);
router.put('/blog/:id', blog.update);


module.exports = router;
