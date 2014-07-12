"use strict";
var models = require('./models'),
    login_required = require('../useful/actions/decorators').login_required,
    BlogEntry = models.BlogEntry,

    index = function (req, res) {
        BlogEntry.find(
            {
                userId: req.user._id, 
                trashed: false
            }
          , function (err, docs) {
            res.render('blog/list', {
                'docs': docs
            });
        });
    },

    show = function (req, res) {
        BlogEntry.findByIdAndUpdate(req.params.id, 
            {
                $inc: {'meta.exposures': 1}
            },
            function (err, doc) {
                if (err) {
                    console.log(err);
                    res.send(400, 'Something wrong.');
                    return;
                }
                res.render('blog/show', {
                    entry: doc
                });
            }
        );
    },

    new_ = function (req, res) {
        res.render('blog/new');
    },

    create = function (req, res) {
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

    edit = function (req, res) {
        BlogEntry.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send(404, 'No article found.')
            } else if (doc.userId.equals(req.user._id)) {
                res.render('blog/edit', {
                    blog: doc
                });
            } else {
                res.send(403, "403 Forbidden:"+
                         " the server can be reached and understood"+
                         " the request, but refuses to take any further action.");
            }
        });
    },

    update = function (req, res) {
        BlogEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            }
          , {$set:  { 
                        title: req.body.blog.title,
                        body: req.body.blog.body
                    }
            }
          , function (err, blogEntry) {
                if (err) {
                    console.log('::blog update error')
                    res.send(404, 'oops.');
                } else {
                    res.redirect('/blog/');
                }
            }
        );
    },

    trash = function (req, res) {
        BlogEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            }
          , {
                $set: {trashed: true }
            }
          , function (err, doc) {
                if (err) {
                    console.log('::blog trash error');
                    // handle error

                } else {
                    res.redirect('/blog/');
                }
            }
        );
    },

    blog_actions = {
        'update':   login_required(update),
        'new_':     login_required(new_),
        'index':    login_required(index),
        'edit':     login_required(edit),
        'create':   login_required(create),
        'trash':    login_required(trash), 
        'show':     show
    };

module.exports = blog_actions;
