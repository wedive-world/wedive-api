const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    category: String,
    level: Number,
    title: { type: Schema.Types.ObjectId, ref: 'Content' },
    description: { type: Schema.Types.ObjectId, ref: 'Institution' },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
});

module.exports = mongoose.model('License', schema);