const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    description: String,
    reference: String,

    uploaderId: Schema.Types.ObjectId,
    mimeType: String,
    encoding: String,
    fileSize: Number,

    s3EndPoint: String,
    s3Region: String,
    s3BucketName: String,
    s3ObjectKey: String,

    thumbnailUrl: String,

    contentMap: {
        type: Map,
        of: { type: Schema.Types.ObjectId, ref: 'ImageContent' }
    },

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', schema);