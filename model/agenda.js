const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    targetId: { type: Schema.Types.ObjectId, index: true },
    types: [{ type: Schema.Types.ObjectId, ref: 'AgendaType' }],

    author: { type: Schema.Types.ObjectId, ref: 'User' },
    languageCode: String,

    agendaParent: { type: Schema.Types.ObjectId, index: true },

    title: String,
    content: String,
    hashTags: [{ name: String }],

    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],

    reviewCount: Number,

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Agenda', schema);

schema.index({
    'title': 'text',
    'content': 'text',
}, { default_language: "ngram" })