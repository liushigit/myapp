var mongoose = require('../db')
var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

var BlogEntrySchema = Schema({
    title: String, 
    body: String,
    created: Date,
    updated: { type: Date, default: Date.now },
    userId: Schema.Types.ObjectId
});

var BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);

module.exports = {}
module.exports.BlogEntry = BlogEntry;
