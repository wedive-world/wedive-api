const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    latitude: Number,
    longitude: Number,
    propertyMap: {
        type: Map,
        of: String
    },
    countryCode: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveSte', schema);