const mongoose = require('mongoose');
const { DB_URL, DB_NAME, DB_PATH } = process.env;

const MONGO_URL = DB_PATH || `mongodb://localhost:4100/platform`;

// Connect to mongoDB
module.exports = (() => {

    const db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        // CONNECTED TO MONGODB SERVER
        console.log("Connected to mongod server");
    });

    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

module.exports.schema = {
    DiveCenter: require('./dive-center'),
    User: require('./dive-center'),

    DivingInterest: require('./diving/interest/divingInterest')
}