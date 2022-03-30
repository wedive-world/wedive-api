const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    diveCenter: { type: Schema.Types.ObjectId, ref: 'DiveCenter' },
    peopleNumber: Number,

    startedAt: Date,
    finishedAt: Date,

    name: String,
    phoneNumber: String,

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    status: { type: String, default: 'requested' },
    adminStatus: { type: String, default: 'opened' },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },

    reviewCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', schema);