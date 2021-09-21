const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: { type: Schema.Types.ObjectId, ref: 'Content' },
    description: { type: Schema.Types.ObjectId, ref: 'Content' },
});

module.exports = mongoose.model('Institution', schema);