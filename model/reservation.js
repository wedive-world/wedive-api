const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    diveCenter: { type: Schema.Types.ObjectId, ref: 'DiveCenter' },
    diveShop: { type: Schema.Types.ObjectId, ref: 'DiveShop'},
    peopleNumber: Number,

    startedAt: Date,
    finishedAt: Date,

    name: String,
    email: String,
    phoneNumber: String,

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    status: { type: String, default: 'requested' },
    adminStatus: { type: String, default: 'opened' },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },

    receipts: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],

    reviewCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', schema);