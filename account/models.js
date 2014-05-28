"use strict";

var mongoose = require('../db');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String,
           required: true,
           trim: true,
           match: /[\w\d]{6,20}/
    },
    password: {
        type: String,
        required: true
    }
});

// var UserSchema = Schema({
//     username: String,
//     password: String,
// });

UserSchema.methods.validPassword = function (password) {
    return Utility.encrypt(password) === this.password;
};

var User = mongoose.model('User', UserSchema);

var Utility = {};
Utility.encrypt = function (s) {
    var crypto = require('crypto');
    var shasum =  crypto.createHash('sha1');
    shasum.update(s + 'a photo');
    return shasum.digest('hex');
}

module.exports = {};
module.exports.User = User;
module.exports.Utility = Utility;