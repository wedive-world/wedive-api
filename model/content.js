const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    languageMap: { type: Map, of: String },
    referenceName: String,
    referenceId: Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Content', schema);