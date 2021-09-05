const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
});

module.exports = mongoose.model('Institution', schema);