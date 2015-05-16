var mongoose = require('../db');
var Schema = mongoose.Schema;

var Page = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: false },
    userId: {
        type: Schema.Types.ObjectId, 
        index: 'hashed',
        required: true
    }
});


module.exports = mongoose.model('Page', Page);