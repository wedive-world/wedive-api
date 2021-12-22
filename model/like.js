const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    userId: { type: String, unique: true, index: true },

    targetIds: [Schema.Types.ObjectId],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Like', schema);