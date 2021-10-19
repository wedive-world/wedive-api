const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    titleTranslation: {
        type: Map,
        of: String,
    },
    type: String,
    iconType: String,
    iconName: String,
    iconColor: String,
    iconUrl: String,

    name: String,
    uniqueName: { type: String, index: true, unique: true },
    nameTranslation: { type: Map, of: String },
    description: String,
    descriptionTranslation: { type: Map, of: String },

    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    backgroundImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    youtubeVideoIds: [String],
    referenceUrls: [String],
    memo: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

schema.index({
    'titleTranslation.ko': 'text',
})

// schema.index({
//     'title.en': 'text'
// })

module.exports = mongoose.model('Interest', schema);