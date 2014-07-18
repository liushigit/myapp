"use strict";
var models = require('./models'),
    login_required = require('../useful/actions/decorators').login_required,
    BlogEntry = models.BlogEntry,

    error_handler = function (code, req, res) {
        switch (code) {
            case 404: 
                res.send(404, 'Not found.');
                break;
            case 403:
                res.send(403, "403 Forbidden:"+
                         " the server can be reached and understood"+
                         " the request, but refuses to take any further action.");
                break;
        }
    },

    list_posts_with_tag = function (req, res) {
        var tag = req.param('tag');
        BlogEntry.find(
            {
                'tags': tag
              , 'userId': req.user._id

            }

          , function (err, docs) {
                if (err) {
                    console.log('Error in list_posts_with_tag')
                    return;
                }
                res.render('blog/list', {
                    docs: docs
                });
            }
        );
    },

    index = function (req, res) {
        if (req.param('tag')) {
            return list_posts_with_tag(req, res);
        }

        var paginated_by = 10,
            page = req.param('page') > 0 ? req.param('page') : 1,
            conditions = {
                userId: req.user._id
              , trashed: false
            };

        BlogEntry
        .find(conditions)
        .skip(paginated_by * (page - 1))
        .limit(paginated_by)
        .sort({'updated': 'descending'})
        .exec(  
            function (err, docs) {
                BlogEntry.count(conditions , function (err, count) {
                    if (err) {
                        return;
                    }
                    console.log('index', count)
                    var paginator = require('../useful/template/helpers').paginator
                      , createPagination = paginator(req);

                    res.render('blog/list', {
                        'docs': docs
                      , 'page': page
                      , 'pages': count / paginated_by
                      , 'createPagination': createPagination
                    });
                });
            }
        );
    },

    show = function (req, res) {
        BlogEntry.findByIdAndUpdate(req.params.id, 
            {
                $inc: {'meta.exposures': 1}
            },
            function (err, doc) {
                if (err) {
                    return error_handler(404, req, res);
                }
                res.render('blog/show', {
                    entry: doc
                });
            }
        );
    },

    neu = function (req, res) {
        res.render('blog/new');
    },

    create = function (req, res) {
        var entry = new BlogEntry(req.body.blog);

        entry.userId = req.user._id;
        entry.created = entry.updated = Date.now();
        entry.trashed = false;

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
                error_handler(404, req, res);
            } else if (doc.userId.equals(req.user._id)) {
                res.render('blog/edit', {
                    blog: doc
                });
            } else {
                error_handler(403, req, res);
            }
        });
    },

    update = function (req, res) {
        var entry = req.body.blog || {},
            tags_to_remove = req.body.tags && req.body.tags.toRemove,
            update = {};

        if (typeof entry.tags === 'string') {
            entry.tags = [entry.tags];
        }
        
        entry.updated = Date.now();
        update.$set = entry;

        if (typeof tags_to_remove === 'string') {
            tags_to_remove = [tags_to_remove];
        }

        if (tags_to_remove && !entry.tags) {
            update.$pullAll = {tags: tags_to_remove };
        }

        BlogEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            }
          , update
          , function (err, blogEntry) {
                if (err) {
                    console.log('::blog update error', err)
                    error_handler(403, req, res);
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
                    error_handler(403, req, res);
                } else {
                    res.redirect('/blog/');
                }
            }
        );
    },

    blog_actions = {
        'update':   login_required(update),
        'new':     login_required(neu),
        'index':    login_required(index),
        'edit':     login_required(edit),
        'create':   login_required(create),
        'trash':    login_required(trash), 
        'show':     show
    };

module.exports = blog_actions;
