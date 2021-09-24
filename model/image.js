const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    mimeType: String,
    encoding: String,
    fileSize: Number,
    contentMap: {
        type: Map,
        of: { type: Schema.Types.ObjectId, ref: 'ImageContent' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', schema);