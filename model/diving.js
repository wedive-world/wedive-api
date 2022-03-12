const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    title: String,
    description: String,
    status: { type: String, default: 'searchable' },
    type: [String],

    hostUser: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    maxPeopleNumber: Number,
    participants: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
        status: String,
        birth: Number,
        gender: String,
    }],
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],
    diveCenters: [{ type: Schema.Types.ObjectId, ref: 'DiveCenter' }],

    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: Date.now },

    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    reviewCount: { type: Number, default: 0 },

    chatRoomId: { type: String, index: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    typeDef: { type: String, default: 'Diving' },
});

module.exports = mongoose.model('Diving', schema);

schema.index({
    'title': 'text',
    'description': 'text'
}, { default_language: "ngram" })