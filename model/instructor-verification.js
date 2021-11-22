const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    instructorLicenseImage: { type: Schema.Types.ObjectId, ref: 'Image' },
    instructorType: String,
    isVerified: Boolean,
    verificationReason: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InstructorVerification', schema);