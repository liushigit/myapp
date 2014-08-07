"use strict";

var mongoose = require('../db')
  , Schema = mongoose.Schema
  //, markdown = require('markdown').markdown
  , marked = require('marked')


  , BlogEntrySchema = Schema({
        title: {
            type: String
           ,required: true
        },
        body: {
            type: String
           ,required: true
        },
        created: { 
            type: Date
           ,index: -1
           ,required: true
        },
        updated: { 
            type: Date,
            required: true,
            'default': Date.now,
            index: -1
        },
        username: {
            type: String,
            required: true,
            index: 1
        },
        userId: {
            type: Schema.Types.ObjectId, 
            index: 'hashed',
            required: true
        },
        tags: {
            type: [String], 
            index: 'hashed'
        },
        trashed: {
            type: Boolean,
            required: true,
            'default': false
        },
        published: {
            type: Boolean,
            required: true,
            'default': false
        },
        meta: {
            exposures: {
                type: Number,
                'default': 0
            }
        }

    }, { autoIndex: false });

BlogEntrySchema.virtual('mdRender').get(function () {
    return marked(this.body);
});

var BlogEntry = mongoose.model('BlogEntry', BlogEntrySchema);

module.exports = {
    BlogEntry: BlogEntry
};
