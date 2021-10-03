const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    description: String,
    address: String,
    nameTranslation: {
        type: Map,
        of: String
    },
    descriptionTranslation: {
        type: Map,
        of: String
    },
    addressTranslation: {
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
    minTemperature: Number,
    maxTemperature: Number,
    diveSiteId: Schema.Types.ObjectId,
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DivePoint', schema);

schema.index({
    'nameTranslation.ko': 'text',
})