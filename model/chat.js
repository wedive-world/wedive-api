const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    reads: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', schema);

schema.index({
    'content': 'text',
}, { default_language: "ngram" })