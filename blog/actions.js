var models = require('./models');
var BlogEntry = models.BlogEntry;

var index = function(req, res) {
    console.log(req.user);
    BlogEntry.find({userId: req.user._id}, function (err, docs) {
        res.render('blog/list', {
           'docs': docs
        });
    });
};

var show = function(req, res) {
    BlogEntry.findById(req.params.id, function(err, doc) {
        res.render('blog/show', {
            entry: doc
        });
    });
}

var new_ = function(req, res) {
    req.session.reload(function (err){
        console.log(err);
    });

    res.render('blog/new', {'ttt': req.session.ttt});
};

var create = function(req, res) {
    var entry = new BlogEntry(req.body.blog);

    entry.userId = req.user._id;
    entry.created = Date.now();

    entry.save(function(err) {
        if (!err) {
            res.redirect('/blog/');
        } else {
            req.flash("error", "文章添加失败。");
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
    BlogEntry.findByIdAndUpdate(req.params.id, 
                                {$set: { title: req.body.blog.title,
                                        body: req.body.blog.body
                                }}, 
                                function (err, blogEntry) {
                                    if (!err) {
                                        res.redirect('/blog/');
                                    } else {

                                    }
                                });
};

var blog_actions = {
    'update': update,
    'new_': new_,
    'index': index,
    'edit': edit,
    'create': create,
    'show': show
};

module.exports = blog_actions;