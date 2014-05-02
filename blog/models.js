var mongoose = require('../db')
var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

var BlogEntrySchema = Schema({
    title: String, 
    body: String,
});

var BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);

module.exports = {}
module.exports.BlogEntry = BlogEntry;
