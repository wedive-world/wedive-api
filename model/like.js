const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    userId: { type: Schema.Types.ObjectId, index: true },
    targetId: { type: Schema.Types.ObjectId, index: true },
    value: Boolean,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Like', schema);