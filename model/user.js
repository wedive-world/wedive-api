const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    birthAge: String,
    gender: Number,
    profileImage: { type: Schema.Types.ObjectId, ref: 'Image' },
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    countryCode: String,
    languageCodes: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', schema);