const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    category: String,
    level: Number,
    title: String,
    description: String,
    institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
});

module.exports = mongoose.model('License', schema);