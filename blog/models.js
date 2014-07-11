var mongoose = require('../db'),
	Schema = mongoose.Schema,


	BlogEntrySchema = Schema({
    title: String, 
    body: String,
    created: Date,
    updated: { type: Date, 'default': Date.now },
    userId: Schema.Types.ObjectId
}),

	BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);

module.exports = {}
module.exports.BlogEntry = BlogEntry;
