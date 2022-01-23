const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    word: String,
    createdAt: { type: Date, default: Date.now }
});

schema.index({
    'word': 'text'
 }, { default_language: "ngram" })

module.exports = mongoose.model('SearchSuggestion', schema);