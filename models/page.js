var mongoose = require('../db');
var Schema = mongoose.Schema;

var marked = require('marked')

var Page = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: false },
    userId: {
        type: Schema.Types.ObjectId, 
        index: 'hashed',
        required: true
    },
    username: {
        type: String, required: true
    },
    isHome: Boolean
});

Page.virtual('pageUrl').get(function(){
    var url = '/pages/' + this.username
    if (!this.isHome) {
        url = url + '/' + this._id
    }
    return url
})


Page.virtual('mdRender').get(function () {
    return marked(this.body);
});


module.exports = mongoose.model('Page', Page);