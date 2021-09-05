const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    gender: Number,
    description: String,
    profileImage: { type: Schema.Types.ObjectId, ref: 'Image' },
    licenseIds: [{ type: Schema.Types.ObjectId, ref: 'License' }],
    countryCode: String,
    languageCodes: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instructor', schema);