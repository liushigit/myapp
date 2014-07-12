"use strict";

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp_dev3');

module.exports = mongoose;
