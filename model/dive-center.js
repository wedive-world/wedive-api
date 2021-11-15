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

    latitude: { type: Number, index: true, },
    longitude: { type: Number, index: true, },
    address: String,
    addressTranslation: { type: Map, of: String },
    countryCode: String,

    publishStatus: String,

    aliases: [String],
    aliasesString: String,
    aliasesStringTranslation: { type: Map, of: String },
    searchTerms: [String],
    searchTermsString: String,
    searchTermsStringTranslation: { type: Map, of: String },

    phoneNumber: String,
    email: { type: String, match: /.+\@.+@..+/ },

    divingType: [String],
    enteranceLevelFree: String,
    enteranceLevelScuba: String,
    institutionTypes: [String],
    openingHours: [String],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    managers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    clerks: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    webPageUrl: String,
    geoAddress: String,

    adminScore: Number,
    viewScore: Number,
    educationScore: Number,
    facilityScore: Number,
    serviceScore: Number,

    wediveComments: [String],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveCenter', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
}, { default_language: "ngram" })