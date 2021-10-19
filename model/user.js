const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    email: { type: String, unique: true },
    birth: Number,
    gender: String,
    profileImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    diveInterests: [{ type: Schema.Types.ObjectId, ref: 'DiveInterest' }],
    countryCode: String,
    mainLanguageCode: String,
    languageCodes: [String],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', schema);