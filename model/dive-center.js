const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator')

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
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
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
    email: {
        type: String,
        validate: [
            {
                validator: function (value) {
                    if (!value) {
                        return true
                    } else {
                        return isEmail(value)
                    }
                },
                message: 'invalid email'
            },
        ]
    },

    divingType: [String],
    enteranceLevelFree: String,
    enteranceLevelScuba: String,
    institutionTypes: [String],
    openingHours: [[String]],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    managers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    clerks: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    webPageUrl: String,
    geoAddress: String,

    adminScore: { type: Number, default: 0, index: true },
    viewScore: Number,
    educationScore: Number,
    facilityScore: Number,
    serviceScore: Number,

    wediveComments: [String],

    tickets: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    educations: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    courses: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    rentals: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

    views: Number,
    likes: Number,

    reviewCount: Number,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveCenter', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
    'addressTranslation.ko': 'text',
}, { default_language: "ngram" })