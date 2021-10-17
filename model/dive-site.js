const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    nameTranslation: { type: Map, of: String },
    description: String,
    descriptionTranslation: { type: Map, of: String },
    
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    youtubeVideoIds: [String],
    referenceUrls: [String],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    latitude: { type: Number, index: true, },
    longitude: { type: Number, index: true, },
    address: String,
    addressTranslation: { type: Map, of: String },
    countryCode: String,

    waterTemperatureScore: Number,
    eyeSiteScore: Number,
    adminScore: Number,

    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveSite', schema);

schema.index({
    'nameTranslation.ko': 'text',
})