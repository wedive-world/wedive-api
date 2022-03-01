const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    targetId: Schema.Types.ObjectId,
    types: [{ type: Schema.Types.ObjectId, ref: 'AgendaType' }],

    author: { type: Schema.Types.ObjectId, ref: 'User' },
    languageCode: String,

    title: String,
    content: String,
    hashTags: String,

    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],

    reviewCount: Number,

    views: Number,
    likes: Number,
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Agenda', schema);