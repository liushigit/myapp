"use strict";

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('./models').User,
    Utility = require('./models').Utility,
    decorators = require('../useful/actions/decorators')


router.get('/login', (req, res) => {
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

const SUCCESS_URL = '/login'

const PASSWORD_URL = '/changepass'
router.get(PASSWORD_URL, decorators.login_required((req, res, next) => {
                            res.render('account/changepass');
                         }))

router.post(PASSWORD_URL, decorators.login_required((req, res, next) => {
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
                return res.render('account/changepass', {
                    msgs: req.flash()
                })
            })
        } else {
            req.flash("error", "密码修改失败")
            res.render('account/changepass', {
                msgs: req.flash()
            })
        }
    })
}))

router.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
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
            //return res.redirect('/u/'+ user.username +'/blog/');
            return res.redirect('/pages/')
        });
    })(req, res, next);
});

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



router.post('/register', (req, res) => {
    const username = req.param('username').trim()
    const password = req.param('password')
    const confirm = req.param('password-confirm')

    var redirectURL = '/register'
    var error_found = false

    User.findOne({ username: username }, (err, user) => {

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
                             'password': Utility.encrypt(password)})

            user.save((err) => {
                if (err) {
                    // error_found = true;
                    if (err.errors.username) {
                        req.flash('username',
                                  err.errors.username.message)
                    }
                } else {
                    redirectURL = SUCCESS_URL
                }
            });
        }

        res.redirect(redirectURL)
    })
})

module.exports = router;
