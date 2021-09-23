const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: Map,
        of: String
    },
    description: {
        type: Map,
        of: String
    },
    latitude: {
        type: Number,
        index: true,
    },
    longitude: {
        type: Number,
        index: true,
    },
    minDepth: Number,
    maxDepth: Number,
    diveSiteId: Schema.Types.ObjectId,
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DivePoint', schema);