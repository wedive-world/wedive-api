const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    introduction: { type: Schema.Types.ObjectId, ref: 'Introduction' },
    place: { type: Schema.Types.ObjectId, ref: 'Place' },

    phoneNumber: String,

    supportFreeDiving: Boolean,
    supportScubaDiving: Boolean,

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    diveSites: [{ type: Schema.Types.ObjectId, ref: 'DiveSite' }],
    divePoints: [{ type: Schema.Types.ObjectId, ref: 'DivePoint' }],

    managers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    clerks: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiveCenter', schema);