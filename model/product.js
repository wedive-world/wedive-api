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

    options: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

    courseInformations: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    price: Number,
    type: [String],

    amount: Number,
    unitName: String,
    unitNameTranslation: { type: Map, of: String },

    hours: Number,
    days: Number,

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    
    briefIcon: { type: Schema.Types.ObjectId, ref: 'Image' },
    cautions: [String],

    createdAt: Date,
    updatedAt: Date,


    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', schema);

schema.index({
    'nameTranslation.ko': 'text',
    'aliasesStringTranslation.ko': 'text',
    'searchTermsStringTranslation.ko': 'text',
}, { default_language: "ngram" })