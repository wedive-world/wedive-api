const mongoose = require('mongoose');
const { DB_URL, DB_NAME } = process.env;

const MONGO_URL = `mongodb://localhost:27017/platform`;

// Connect to mongoDB
module.exports = () => {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB Connected')
    }).catch(err => {
        console.log(err);
    });
}