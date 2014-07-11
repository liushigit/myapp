var models = require('./models'),
    login_required = require('../useful/actions/decorators').login_required,
    BlogEntry = models.BlogEntry,

    index = function(req, res) {
        BlogEntry.find({userId: req.user._id}, function (err, docs) {
            res.render('blog/list', {
               'docs': docs
            });
        });
    },

    show = function(req, res) {
        BlogEntry.findById(req.params.id, function (err, doc) {
            res.render('blog/show', {
                entry: doc
            });
        });
    },

    new_ = function(req, res) {
        res.render('blog/new');
    },

    create = function(req, res) {
        var entry = new BlogEntry(req.body.blog);

        entry.userId = req.user._id;
        entry.created = Date.now();

        entry.save(function (err) {
            if (!err) {
                res.redirect('/blog/');
            } else {
                req.flash("error", "文章添加失败。");
                res.redirect('/blog/new');
            }
        });
    },

    edit = function(req, res) {
        BlogEntry.findById(req.params.id, function (err, doc) {
            res.render('blog/edit', {
                blog: doc
            });
        });
    },

    update = function(req, res) {
        BlogEntry.findByIdAndUpdate(
            req.params.id, 
            {$set: { title: req.body.blog.title,
                     body: req.body.blog.body
            }}, 
            function (err, blogEntry) {
                if (!err) {
                    res.redirect('/blog/');
                } else {

                }
            });
    },

    blog_actions = {
        'update':   login_required(update),
        'new_':     login_required(new_),
        'index':    login_required(index),
        'edit':     login_required(edit),
        'create':   login_required(create),
        'show':     show
    };

module.exports = blog_actions;