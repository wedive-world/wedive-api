const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    title: String,
    description: String,

    notices: [{ type: Schema.Types.ObjectId, ref: "Agenda" }],

    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],

    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    languageCode: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Community', schema);

schema.index({
    'title': 'text',
    'description': 'text'
}, { default_language: "ngram" })