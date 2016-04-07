var mongoose = require('mongoose');
var webConfig = require("../config/WebConfig");
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256
    },
    nameUrl: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256
    },
    content: {
        type: String,
        required: true
    },
    image: {
        main: { type: String },
        mid: { type: String },
        thumbnail: { type: String },
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    inActiveReason: {
        type: String
    },
    //set default createdAt and updatedAt
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }

});

//pre update
articleSchema.pre('update', function() {
    this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = articleSchema;
module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
