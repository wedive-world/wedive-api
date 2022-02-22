const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    userId: { type: Schema.Types.ObjectId, index: true },
    targetId: Schema.Types.ObjectId,
    targetType: String,
    subjectId: Schema.Types.ObjectId,
    subjectType: String,
    event: String,
    title: String,
    message: String,
    read: Boolean,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', schema);