const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    uniqueName: { type: String, index: true, unique: true },
    nameTranslation: { type: Map, of: String },
    description: String,
    descriptionTranslation: { type: Map, of: String },

    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    youtubeVideoIds: [String],
    referenceUrls: [String],
    memo: String,

    publishStatus: String,

    month1: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month2: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month3: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month4: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month5: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month6: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month7: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month8: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month9: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month10: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month11: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    month12: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    latitude: { type: Number, index: true, },
    longitude: { type: Number, index: true, },
    address: String,
    addressTranslation: { type: Map, of: String },
    countryCode: String,

    waterTemperatureScore: Number,
    eyeSiteScore: Number,
    adminScore: Number,

    visitTimeDescription: String,
    visitTimeDescriptionTranslation: { type: Map, of: String },
    waterTemperatureDescription: String,
    waterTemperatureDescriptionTranslation: { type: Map, of: String },
    deepDescription: String,
    deepDescriptionTranslation: { type: Map, of: String },
    waterFlowDescription: String,
    waterFlowDescriptionTranslation: { type: Map, of: String },
    eyeSightDescription: String,
    eyeSightDescriptionTranslation: { type: Map, of: String },
    highlightDescription: String,
    highlightDescriptionTranslation: { type: Map, of: String },

    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveSite', schema);

schema.index({
    'nameTranslation.ko': 'text',
})