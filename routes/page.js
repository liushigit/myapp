var Page = require('../models/page'),
    mapper = require('../lib/model-mapper'),
    decorators = require('../useful/actions/decorators'),
    User = require('../account/models').User

module.exports = function(app) {
    
    app.use(function(req, res, next) {
        res.locals.originalUrl = req.originalUrl
        next()
    })
    
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
    
    app.param('username', function(req, res, next, id) {
        User.findOne({username: req.params.username}, function(err, result) {
            if(err) {
                console.log(' user finding error')
                return next(err)
            } 
            if(!result) {
                // Todo: this should be a 404
                return next(new Error("404"))
            }
            next();
        }) 
    })
    
    var MY_PAGES_URL = '/pages'
      , CREATE_PAGE_URL = '/my/pages/create'
      
    app.get(MY_PAGES_URL, function(req, res) {
        Page.find({}, function(err, pages) {
            res.render('page/index', { pages : pages });
        });
    });
    
    
    app.get(CREATE_PAGE_URL, decorators.login_required(
        function(req, res) {
            res.render('page/create', { page : new Page() });
        }, CREATE_PAGE_URL)
    );
    
    function _create_post (req, res) {
        var page = new Page(req.body.page);
        
        page.on('error', function(){})

        page.userId = req.user._id
    	page.username = req.user.username
        
        page.save(function(err) {
            if (err) {
                res.render('page/create', {
                    page : page
                });
            } else {
                res.redirect(MY_PAGES_URL);
            }
        }); 
    }
    
    app.post(CREATE_PAGE_URL, decorators.login_required(_create_post));
    
    app.get('/pages/:username/:pageId', function(req, res, next) {
        if (res.locals.page && 
                res.locals.page.username == req.params.username ) {
            Page.find({
                username: req.params.username
            }, function(err, pages) {
                if(err) {
                    return next(err)
                } else if(res.locals.page) {
                    return res.render('page/pages_public_home', 
                        { pages : pages, 
                          page : res.locals.page });
                }
            })
        } else {
            return next()
        }
    })
    
    app.get('/pages/:username/', function(req, res, next) {
        Page.find({
            username: req.params.username
        }, function(err, pages) {
            if (err) {
                return next(err)
            } else {
                Page.findOne({
                    username: req.params.username,
                    isHome: true
                }, function(err, doc) {
                    if(err) return next(err)
                    res.render('page/pages_public_home', 
                        { pages : pages, 
                         page : doc });
                })
            }
        });
    })


    app.get('/my/pages/:pageId/edit', decorators.owner_required(
        function(req, res) {
            res.render('page/edit');
        }, 'page'));

    app.post('/my/pages/:pageId/edit', function(req, res) {
        //req.body.page.isHome = req.body.page.isHome != "false"
        mapper.map(req.body.page).to(res.locals.page);
        res.locals.page.save(function(err) {
            if (err) {
                res.render('page/edit');
            } else {
                res.redirect(MY_PAGES_URL);
            }
        });
    });

    app.get('/my/pages/:pageId/detail', function(req, res) {
        res.render('page/detail');
    });

    app.get('/my/pages/:pageId/delete', function(req, res) {
        res.render('page/delete');
    });

    app.post('/my/pages/:pageId/delete', function(req, res) {
        Page.remove({ _id : req.params.pageId }, function(err) {
            res.redirect(MY_PAGES_URL);
        });
    });
}

// Used to build the index page. Can be safely removed!
module.exports.meta = {
    name : 'Page',
    route : '/pages'
}
