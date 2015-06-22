var mongoose = require('../db');
var Schema = mongoose.Schema;

var marked = require('marked')

var Page = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: false },
    order: {type: Number, required: true, default: -1 },
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


var _moveItem = function(info) {
    var movedItem = info[0]
    var targetItem = info[1]
    var username = info[2]
    var direction
    
    if (movedItem.order < targetItem.order) {
        direction = 'right'
    } else if (movedItem.order > targetItem.order) {
        direction = 'left'
    }
    
    return new Promise(function(resolve, reject) {
        var bulk = PageModel.collection.initializeOrderedBulkOp()
        
        var dstOrder = -1;
        if (direction === 'left') {
            bulk.find({order: {$gte: targetItem.order, $lt: movedItem.order}, 
                       username: username })
                .update({$inc: {order: 1}})
            dstOrder = targetItem.order
            
        } else if (direction === 'right') {
            bulk.find({order: {$gt: movedItem.order, $lt: targetItem.order}, 
                       username: username })
                .update({$inc: {order: -1}})
            dstOrder = targetItem.order - 1
        }
        
        bulk.find({_id: movedItem._id, username: username})
            .updateOne({$set: {order: dstOrder}})
        
        bulk.execute( function(err, bulkResult) {
            if (err) {
                //
                console.log(err.toString())
                reject(err)
            }
            // 
            console.log('resolveddd')
            console.log(bulkResult.getRawResponse())
            resolve(bulkResult)
        })
    })
}


var _moveItemToEnd = function (info) {
    var movedItem = info[0]
    var maxOrderNumber =  (Array.isArray(info[1]) && info[1][0].maxOrderNumber) || 0;
    var username = info[2]
    
    return new Promise(function(resolve, reject) {
        var bulk = PageModel.collection.initializeOrderedBulkOp()
        bulk.find({order: {$gt: movedItem.order, $lte: maxOrderNumber}, 
                       username: username })
                .update({$inc: {order: -1}})
        bulk.find({_id: movedItem._id, username: username})
            .updateOne({$set: {order: maxOrderNumber}})

        bulk.execute( function(err, bulkResult) {
            if (err) {
                // 
                console.log(err.toString())
                reject(err)
            }
            //
            console.log(bulkResult.getRawResponse())
            resolve(bulkResult)
        })
    })
}


Page.statics.reorder = function (movedItemId, targetItemId, username) {
    var getMovedItem = this.findOne({_id: mongoose.Types.ObjectId(movedItemId),
                                     username: username })
    if (targetItemId) {
        var getTargetItem = this.findOne({_id: mongoose.Types.ObjectId(targetItemId),
                                          username: username })
        return Promise.all([getMovedItem.exec(), 
                            getTargetItem.exec(),
                            username]).then(_moveItem)
    } else {
        // return new Promise(function(resolve, reject) { resolve(3); });
        return Promise.all([getMovedItem.exec(), 
                            this.getMaxOrderNumberForUser(username).exec(),
                            username]).then(_moveItemToEnd)
    }
}


Page.statics.getMaxOrderNumberForUser = function (username) {
    return this.aggregate([
        {$group : {
            _id: {userId: "$userId", username: "$username"},
            maxOrderNumber: {$max: "$order"}
        }}, 
        {$project: {
            username: '$_id.username',
            maxOrderNumber: "$maxOrderNumber"
        }},
        {$match: {
            username: username
        }} 
    ])
}

Page.statics.findUnorderedPagesForUser = function (username) {
    return this.find({
        username: username,
        $or: [{order: null}, {order: -1}]
    }).select('_id')
}

var PageModel = mongoose.model('Page', Page)
module.exports = PageModel