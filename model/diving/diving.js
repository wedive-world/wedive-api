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
    initalPeople: Number,
    startAt: Date,
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    candidates: [{ type: Schema.Types.Array, ref: 'User' }],
    divingLocations: [{
        locationType: String,
        locationId: Schema.Types.ObjectId,
        latitude: Number,
        longitude: Number,
        title: { type: Schema.Types.Map, of: String },
        description: { type: Schema.Types.Map, of: String },
    }],
    ageInterests: [{ type: Schema.Types.ObjectId, ref: 'DivingInterest' }],
    genderInterests: [{ type: Schema.Types.ObjectId, ref: 'DivingInterest' }],
    divingInterests: [{ type: Schema.Types.ObjectId, ref: 'DivingInterest' }],
    amityInterests: [{ type: Schema.Types.ObjectId, ref: 'DivingInterest' }],
    EnvironmentInterests: [{ type: Schema.Types.ObjectId, ref: 'DivingInterest' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Diving', schema);