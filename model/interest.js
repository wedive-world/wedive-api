const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    titleTranslation: {
        type: Map,
        of: String,
    },
    type: String,
    iconType: String,
    iconName: String,
    iconColor: String,
    iconUrl: String,

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

    aliases: [String],
    aliasesString: String,
    aliasesStringTranslation: { type: Map, of: String },
    searchTerms: [String],
    searchTermsString: String,
    searchTermsStringTranslation: { type: Map, of: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Interest', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'titleTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
 }, { default_language: "ngram" })