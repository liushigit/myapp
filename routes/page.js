var Page = require('../models/page'),
    mapper = require('../lib/model-mapper');


module.exports = function(app) {

    app.param('pageId', function(req, res, next, id) {
        Page.findById(id, function(err, page) {
            if (err) {
                next(err);
            } else {
                res.locals.page = page;
                next();
            }
        });
    });
    
    app.get('/pages', function(req, res) {
        Page.find({}, function(err, pages) {
            res.render('page/index', { pages : pages });
        });
    });

    app.get('/pages/create', function(req, res) {
        res.render('page/create', { page : new Page() });
    });

    app.post('/pages/create', function(req, res) {
        // console.log(req.body)
        var page = new Page(req.body.page);
        page.on('error', function(){})
        page.save(function(err) {
            if (err) {
                res.render('page/create', {
                    page : page
                });
            } else {
                res.redirect('/pages');
            }
        });
    });

    app.get('/pages/:pageId/edit', function(req, res) {
        res.render('page/edit');
    });

    app.post('/pages/:pageId/edit', function(req, res) {
       /* var entry = req.body.page || {}
           ,update = {}

        update.$set = entry

        Page.findOneAndUpdate(
            {
                _id: req.params.pageId
                // username: username,
                //userId: req.user._id
            }
          , update
          , function (err, data) {
                if (err) {
                    res.locals.page = entry
                    res.render('page/edit');
                } else {
                    console.log("suav")
                    res.redirect('/pages');
                }
            }
        ); */
        mapper.map(req.body.page).to(res.locals.page);

        res.locals.page.save(function(err) {
            if (err) {
                res.render('page/edit');
            } else {
                res.redirect('/pages');
            }
        });
    });

    app.get('/pages/:pageId/detail', function(req, res) {
        res.render('page/detail');
    });

    app.get('/pages/:pageId/delete', function(req, res) {
        res.render('page/delete');
    });

    app.post('/pages/:pageId/delete', function(req, res) {
        Page.remove({ _id : req.params.pageId }, function(err) {
            res.redirect('/pages');
        });
    });
}

// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Page',
    route : '/pages'
}
