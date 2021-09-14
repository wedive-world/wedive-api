const mongoose = require('mongoose');
const { DB_URL, DB_NAME } = process.env;

const MONGO_URL = `mongodb://localhost:4100/platform`;

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

