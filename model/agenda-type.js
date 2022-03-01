const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    name: String,
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AgendaType', schema);