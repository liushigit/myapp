"use strict";

var mongoose = require('../db'),
    Schema = mongoose.Schema,

    UserSchema = new Schema({
        username: { 
            type: String,
            index: {
                unique: true
            },
            required: true,
            trim: true,
            match: /[\w\d]{6,20}/
        },
        password: {
            type: String,
            required: true
        }
    }, {
        autoIndex: false
    });

UserSchema.methods.validPassword = function (password) {
    return Utility.encrypt(password) === this.password;
};

var User = mongoose.model('User', UserSchema),

    Utility = {};

Utility.encrypt = function (s) {
    var crypto = require('crypto');
    var shasum =  crypto.createHash('sha1');
    shasum.update(s + 'a photo');
    return shasum.digest('hex');
};

module.exports = {};
module.exports.User = User;
module.exports.Utility = Utility;