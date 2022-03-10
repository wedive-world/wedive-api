const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    title: String,
    description: String,
    type: [String],

    targetId: Schema.Types.ObjectId,
    targetType: String,

    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },

    hostUser: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
        status: String,
        birth: Number,
        gender: String,
    }],

    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    youtubeVideoIds: [String],
    referenceUrls: [String],
    memo: String,

    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],
    diveCenters: [{ type: Schema.Types.ObjectId, ref: 'DiveCenter' }],

    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: Date.now },

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    targetId: Schema.Types.ObjectId,
    targetType: String,

    latitude: { type: Number, index: true, },
    longitude: { type: Number, index: true, },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },

    divingType: [String],

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    reviewCount: Number,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DivingHistory', schema);
