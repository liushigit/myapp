var Page = require('../models/page'),
    mapper = require('../lib/model-mapper'),
    decorators = require('../useful/actions/decorators')

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

    app.get('/pages/create', decorators.login_required(
        function(req, res) {
            res.render('page/create', { page : new Page() });
        }, '/pages/create')
    );
    
    function _create_post (req, res) {
        var page = new Page(req.body.page);

        page.on('error', function(){})

        page.userId = req.user._id

        page.save(function(err) {
            if (err) {
                res.render('page/create', {
                    page : page
                });
            } else {
                res.redirect('/pages');
            }
        }); 
    }
    
    app.post('/pages/create', decorators.login_required(_create_post));

    app.get('/pages/:pageId/edit', decorators.owner_required(
        function(req, res) {
            res.render('page/edit');
        }, 'page'));

    app.post('/pages/:pageId/edit', function(req, res) {
        
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
