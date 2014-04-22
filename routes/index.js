var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myapp_dev')

var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

var BlogEntrySchema = Schema({
    title: String, 
    body: String,
});

var BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/blog/', function(req, res) {
	// console.log('processing...')
    BlogEntry.find({}, function(err, docs) {
    	res.render('blog/list', {
    	   'docs': docs
    	});
    });
});

router.post('/blog/', function(req, res) {
    var entry = new BlogEntry(req.body.blog);
    console.log(req.body.blog.body);
    entry.save(function(err) {
    	if (!err) {
    		res.redirect('/blog/');
    	} else {
    		res.redirect('/blog/new');
    	}
    });

});

router.get('/blog/new', function(req, res) {
	res.render('blog/new', {});
});

router.get('/blog/:id/edit', function(req, res) {
	BlogEntry.findById(req.params.id, function(err, doc) {
        res.render('blog/edit', {
            blog: doc
        });
	});
});

router.put('/blog/:id', function(req, res) {
    BlogEntry.findById(req.params.id, function(err, doc) {
        doc.title = req.body.blog.title;
        doc.body = req.body.blog.body;
        doc.save(function(err) {
            if (!err) {
                res.redirect('/blog/');
            } else {

            }
        });
    });
});

router.get('/hello', function(req, res) {
	res.render('hello', { title: 'Hello World' });
});

module.exports = router;
