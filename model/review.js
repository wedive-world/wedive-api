const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    targetId: Schema.Types.ObjectId,
    targetType: String,

    author: { type: Schema.Types.ObjectId, ref: 'User' },
    languageCode: String,

    title: String,
    content: String,
    rating: Number,
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    
    reviewCount: { type: Number, default: 0 },
    
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', schema);