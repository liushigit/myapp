var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myapp_dev')

module.exports = mongoose
