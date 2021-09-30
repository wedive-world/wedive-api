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