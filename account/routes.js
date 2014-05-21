"use strict";

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('./models').User;


router.get('/login', function (req, res) {
    res.render('account/login', { title: 'Login'});
});

/*router.post('/login', passport.authenticate('local',
                                            { successRedirect: '/blog/',
                                              failureRedirect: '/login',
                                              failureFlash: "用户名或密码错误",
                                              successFlash: "欢迎",
                                          })
);*/

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', '用户名或密码错误。');
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', '欢迎回来！');
            return res.redirect('/blog/');
        });
    })(req, res, next);
});

router.get('/register', function (req, res) {
    res.render('account/register', { title: '注册'});
});

router.post('/register', function (req, res) {

    var username = req.param('username'),
        password = req.param('password'),
        confirm = req.param('password-confirm');

    User.findOne({ username: username }, function (err, user) {
        if (password != confirm) {
            console.log("in post");
            req.flash('error', '两次输入的密码不一致。');
        }

        if (user) {
            console.log("inpost");
            console.log(req.flash('error', "ABCCC"));
        } else if (password == confirm ) {
            user = new User({'username': username, 
                             'password': password });
            user.save(function (err) {
                if (!err) {
                    req.flash('error', "Some Error");
                } 
            });
        } 
        res.redirect('/register');
    });
});

module.exports = router;