var models = require('./models');
var BlogEntry = models.BlogEntry;

var index = function(req, res) {
    BlogEntry.find({}, function (err, docs) {
        res.render('blog/list', {
           'docs': docs 
        });
    });
};

var new_ = function(req, res) {
    req.session.reload(function (err){
        console.log(err);
    });

    res.render('blog/new', {'ttt': req.session.ttt});
};

var create = function(req, res) {
    var entry = new BlogEntry(req.body.blog);
    
    entry.save(function(err) {
        if (!err) {
            res.redirect('/blog/');
        } else {
            res.redirect('/blog/new');
        }
    });
};

var edit = function(req, res) {
    BlogEntry.findById(req.params.id, function(err, doc) {
        res.render('blog/edit', {
            blog: doc
        });
    });
};

var update = function(req, res) {
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
};

var blog_actions = {
    'update': update,
    'new_': new_,
    'index': index,
    'edit': edit,
    'create': create
};

module.exports = blog_actions;