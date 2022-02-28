const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    diving: { type: Schema.Types.ObjectId, ref: 'Diving', index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: String,
    status: String,
    birth: Number,
    gender: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    typeDef: { type: String, default: 'DivingParticipant' },
});

module.exports = mongoose.model('DivingParticipant', schema);
