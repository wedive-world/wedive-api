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
    nickName: { type: String, maxLength: 12 },
    name: String,

    birthAge: { type: Number, min: 1900, max: 2100 },
    gender: String,
    residence: String,

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    divingLog: Number,
    freeDivingBests: [[String]],
    freeLicenseLevel: String,
    freeLicenseType: String,

    scubaLicenseLevel: String,
    scubaLicenseType: String,

    instructorLicenseImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    instructorTypes: [String],

    instructorVerifications: [{ type: Schema.Types.ObjectId, ref: 'InstructorVerification' }],
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    divingHostCount: { type: Number, default: 0 },
    divingParticipantCount: { type: Number, default: 0 },

    recommendationSeed: { type: Number, default: 0 },

    isAdmin: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    typeDef: { type: String, default: 'User' },
});

schema.index({
    'nickName': 'text'
}, { default_language: "ngram" })

module.exports = mongoose.model('User', schema);