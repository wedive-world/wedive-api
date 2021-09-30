const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    description: String,
    uploaderId: Schema.Types.ObjectId,
    mimeType: String,
    encoding: String,
    fileSize: Number,
    s3EndPoint: String,
    s3Region: String,
    s3BucketName: String,
    s3ObjectKey: String,
    contentMap: {
        type: Map,
        of: { type: Schema.Types.ObjectId, ref: 'ImageContent' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', schema);