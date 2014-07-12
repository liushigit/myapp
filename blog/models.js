"use strict";

var mongoose = require('../db'),
    Schema = mongoose.Schema,


    BlogEntrySchema = Schema({
        title: String,
        body: String,
        created: { 
            type: Date,
            index: 1
        },
        updated: { 
            type: Date,
            'default': Date.now,
            index: 1
        },
        userId: {
            type: Schema.Types.ObjectId, 
            index: 'hashed'
        },
        tags: {
            type: [String], 
            index: 'hashed'
        },
        trashed: Boolean,
        meta: {
            exposures: {
                type: Number,
                'default': 0
            }
        }

    }, { autoIndex: false }),

    BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);

module.exports = {
    BlogEntry: BlogEntry
};
