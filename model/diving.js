const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    freeDiving: Boolean,
    scubaDiving: Boolean,
    hostUser: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    departure: String,
    budget: String,
    status: Number,
    totalPeople: Number,
    startAt: Date,
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        birth: Number,
        gender: String,
    }],
    applicants: [{ type: Schema.Types.Array, ref: 'User' }],
    divingLocations: [{
        locationType: String,
        locationId: Schema.Types.ObjectId,
        latitude: Number,
        longitude: Number,
        title: { type: Schema.Types.Map, of: String },
        description: { type: Schema.Types.Map, of: String },
        startAt: Date,
        endAt: Date
    }],
    ageInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    genderInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    divingInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    amityInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    EnvironmentInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Diving', schema);