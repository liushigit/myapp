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

    list_posts_with_tag = function (req, res, next) {
        var tag = req.param('tag');
        BlogEntry.find(
            {
                'tags': tag
              , 'username': req.params.user

            }

          , function (err, docs) {
                if (err) {
                    console.log('Error in list_posts_with_tag')
                    return next(err);
                }
                res.render('blog/list', {
                    docs: docs
                });
            }
        );
    },

    index = function (req, res, next) {
        if (req.param('tag')) {
            return list_posts_with_tag(req, res, next);
        }

        var paginated_by = 10
          , page = req.param('page') > 0 ? req.param('page') : 1
          , conditions = {
                username: req.params.user
              , trashed: false
            };

        BlogEntry
        .find(conditions)
        .skip(paginated_by * (page - 1))
        .limit(paginated_by)
        .sort({'updated': 'descending'})
        .exec(  
            function (err, docs) {
                if (err) {
                    return next(err);
                }
                BlogEntry.count(conditions , function (err, count) {
                    if (err) {
                        return next(err);
                    }
                    // console.log('index', count)
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

    show = function (req, res, next) {
        BlogEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                username: req.params.user

            },
            {
                $inc: {'meta.exposures': 1}
            },
            function (err, doc) {
                if (err || !doc) {
                    return next(err);
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

    create = function (req, res, next) {
        var entry = new BlogEntry(req.body.blog)
          , username = req.user.username;

        entry.userId = req.user._id;
        entry.username = username;
        entry.created = entry.updated = Date.now();
        entry.trashed = false;

        entry.save(function (err) {
            if (!err) {
                res.redirect('/u/'+ username + '/blog/');
            } else {
                req.flash("error", "文章添加失败。");
                res.redirect('/blog/new');
            }
        });
    },

    edit = function (req, res, next) {
        BlogEntry.findById(req.params.id, function (err, doc) {
            if (err) {
                next(err);
            } else if (doc.userId.equals(req.user._id)) {
                res.render('blog/edit', {
                    blog: doc
                });
            } else {
                error_handler(403, req, res);
            }
        });
    },

    update = function (req, res, next) {
        var entry = req.body.blog || {}
          , username = req.user.username
          , tags_to_remove = req.body.tags && req.body.tags.toRemove
          , update = {};

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
                username: username,
                //userId: req.user._id
            }
          , update
          , function (err, blogEntry) {
                if (err) {
                    console.log('::blog update error', err)
                    // error_handler(403, req, res);
                    next(err);
                } else {
                    res.redirect('/u/' + username + '/blog/' + blogEntry._id);
                }
            }
        );
    },

    trash = function (req, res, next) {
        var username = req.user.username;

        BlogEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                username: username
            }
          , {
                $set: {trashed: true }
            }
          , function (err, doc) {
                if (err) {
                    console.log('::blog trash error');
                    error_handler(403, req, res);
                } else {
                    res.redirect('/u/'+ username +'/blog/');
                }
            }
        );
    },

    blog_actions = {
        'update':   login_required(update),
        'new':      login_required(neu),
        'index':    login_required(index),
        'edit':     login_required(edit),
        'create':   login_required(create),
        'trash':    login_required(trash), 
        'show':     show
    };

module.exports = blog_actions;
