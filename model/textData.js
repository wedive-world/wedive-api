const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    ko: String,
    en: String,
    objectName: String,
    objectId: Schema.Types.ObjectId,
    columnName: String,
});

module.exports = mongoose.model('Content', schema);