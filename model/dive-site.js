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
    address: {
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
    adminScore: Number,
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgorundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    youtubeVideoIds: [String],
    referenceUrls: [String],
    countryCode: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveSite', schema);