const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    nameTranslation: { type: Map, of: String },
    description: String,
    descriptionTranslation: { type: Map, of: String },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    divePointId: Schema.Types.ObjectId,
    interest: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Highlight', schema);
