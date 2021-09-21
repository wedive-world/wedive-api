const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    locationType: String,
    locationId: Schema.Types.ObjectId,
    latitude: Number,
    longitude: Number,
    title: { type: Schema.Types.ObjectId, ref: 'Content' },
    description: { type: Schema.Types.ObjectId, ref: 'Content' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Diving', schema);