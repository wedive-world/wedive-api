const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    uid: { type: String, unique: true, index: true },
    authProvider: String,
    oauthToken: String,

    fcmToken: String,

    email: String,
    emailVerified: Boolean,
    phoneNumber: String,
    phoneNumberVerified: Boolean,

    profileImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    nickName: String,
    name: String,

    birthAge: { type: Number, min: 1900, max: 2100 },
    gender: String,
    residence: String,

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    divingLog: Number,
    freeDivingBests: { type: Map, of: String },
    freeLicenseLevel: String,
    freeLicenseType: String,
  
    scubaLicenseLevel: String,
    scubaLicenseType: String,

    instructorLicenseImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    instructorTypes: [String],

    instructorVerifications: [{ type: Schema.Types.ObjectId, ref: 'InstructorVerification' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', schema);