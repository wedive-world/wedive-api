const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    instructorType: [String],
    phoneNumber: String,
    email: String,

    gender: String,
    description: String,

    profileImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }],
    licenseImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    languageCodes: [String],

    diveCenters: [{ type: Schema.Types.ObjectId, ref: 'DiveCenter' }],
    diveSite: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoint: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instructor', schema);