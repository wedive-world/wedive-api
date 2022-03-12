const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    titleTranslation: { type: Map, of: String, },
    description: String,
    descriptionTranslation: { type: Map, of: String },

    cssStyle: String,
    className: String,

    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    previewCount: { type: Number, default: 0 },
    type: String,
    targetType: String,
    arguments: [String],
    searchParams: String,

    view: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recommendation', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
}, { default_language: "ngram" })