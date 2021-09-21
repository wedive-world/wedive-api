const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: { type: Schema.Types.ObjectId, ref: 'Content' },
    iconUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AgeInterest', schema);