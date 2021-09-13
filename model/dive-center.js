const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    address: String,
    phoneNumber: String,
    description: String,
    latitude: Number,
    longitude: Number,
    supportFreeDiving: Boolean,
    supportScubaDiving: Boolean,
    countryCode: String,
    diveSiteIds: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    managerIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveCenter', schema);