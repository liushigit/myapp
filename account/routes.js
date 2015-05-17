"use strict";

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('./models').User,
    Utility = require('./models').Utility;


router.get('/login', function (req, res) {
    res.locals.next_url = req.query.next
    res.render('account/login');
});

/*router.post('/login', passport.authenticate('local',
                                            { successRedirect: '/blog/',
                                              failureRedirect: '/login',
                                              failureFlash: "用户名或密码错误",
                                              successFlash: "欢迎",
                                          })
);*/

router.post('/changepasswd', function (req, res, next) {
    User.findOne({
        _id: req.user._id,
        password: Utility.encrypt(req.body.old_pw)
    }, function(err, doc){
        if(err) return next(err)
        else if (doc) {
            doc.password = Utility.encrypt(req.body.password)
            doc.save(function(err) {
                if(err) return next(err)
                req.flash("success", "密码修改成功")
            })
        } else {
            req.flash("error", "密码修改失败")
        }
        res.render('/changepasswd', {
            msgs: req.flash() 
        })
    })
    
})

router.post('/login', function (req, res, next) {
    
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', '用户名或密码错误。');
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            // req.flash('success', '欢迎回来！');
            if (req.query.next && req.query.next != 'undefined') {
                return res.redirect(req.query.next)
            }
            return res.redirect('/u/'+ user.username +'/blog/');
        });
    })(req, res, next);
});

router.get('/register', function (req, res) {
    res.render('account/register');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function (req, res) {

    var username = req.param('username').trim(),
        password = req.param('password'),
        confirm = req.param('password-confirm'),
        redirectURL = '/register',
        error_found = false;

    User.findOne({ username: username }, function (err, user) {

        if (password !== confirm) {
            req.flash('error', '两次输入的密码不一致。');
            error_found = true;
        }

        if (user) {
            console.log(req.flash('error', "该用户名已经被占用。"));
            error_found = true;

        }

        if (!error_found) {

            user = new User({'username': username,
                             'password': Utility.encrypt(password)});

            user.save(function (err) {
                if (err) {
                    // error_found = true;
                    if (err.errors.username) {
                        req.flash('username',
                                  err.errors.username.message);
                    }
                } else {
                    redirectURL = '/login';
                }

                res.redirect(redirectURL);
            });
        } else {
            res.redirect(redirectURL);
        }
    });
});

module.exports = router;