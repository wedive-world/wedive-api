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
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    address: String,
    addressTranslation: { type: Map, of: String },
    countryCode: String,

    aliases: [String],
    aliasesString: String,
    aliasesStringTranslation: { type: Map, of: String },
    searchTerms: [String],
    searchTermsString: String,
    searchTermsStringTranslation: { type: Map, of: String },

    waterTemperatureScore: { type: Number, default: 0 },
    adminScore: { type: Number, default: 0, index: true },

    minDepth: { type: Number, default: 0 },
    maxDepth: { type: Number, default: 0 },
    minSight: { type: Number, default: 0 },
    maxSight: { type: Number, default: 0 },
    flowRateScore: { type: Number, default: 0 },
    waterEnvironmentScore: { type: Number, default: 0 },
    eyeSightScore: { type: Number, default: 0 },

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

    highlights: [{ type: Schema.Types.ObjectId, ref: 'Highlight' }],
    highlightDescription: String,
    highlightDescriptionTranslation: { type: Map, of: String },

    divingType: [String],

    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    reviewCount: Number,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    typeDef: { type: String, default: 'DiveSite' }
});

module.exports = mongoose.model('DiveSite', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
    'addressTranslation.ko': 'text',
}, { default_language: "ngram" })