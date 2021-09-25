const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    s3EndPoint: String,
    s3Region: String,
    s3BucketName: String,
    s3ObjectKey: String,
    fileSize: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ImageContent', schema);