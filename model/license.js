const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    divingType: String,
    category: String,
    level: String,
    description: String,
    institution: String,
});

module.exports = mongoose.model('License', schema);