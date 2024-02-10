const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    title : String,
    latestChat: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatRoom', schema);