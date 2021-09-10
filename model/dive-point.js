const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    latitude: Number,
    longitude: Number,
    diveSiteId: { type: Schema.Types.ObjectId, ref: 'DiveSite' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DivePoint', schema);