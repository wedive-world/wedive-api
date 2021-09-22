const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: {
        type: Map,
        of: String,
        unique: true
    },
    type: String,
    iconType: String,
    iconName: String,
    iconColor: String,
    iconUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Interest', schema);