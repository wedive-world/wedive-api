const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    licenseImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    licenses: [{ type: Schema.Types.ObjectId, ref: 'License' }],
    instructorType: [String],

    phoneNumber: String,
    email: String,
    gender: String,

    introduction: String,
    careers: [String],

    profileImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    diveCenters: [{ type: Schema.Types.ObjectId, ref: 'DiveCenter' }],
    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instructor', schema);