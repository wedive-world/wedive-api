const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    url: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ImageContent', schema);