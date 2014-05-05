"use strict";

var mongoose = require('../db');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    username: String,
    password: String,
});

UserSchema.methods.validPassword = function (password) {
    console.log(password);
    return password === this.password;
};

var User = mongoose.model('User', UserSchema);

module.exports = {};
module.exports.User = User;