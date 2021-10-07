const mongoose = require('mongoose');
const { DB_URL, DB_NAME, DB_PATH } = process.env;

const MONGO_URL = `${DB_PATH}/${DB_NAME}` || `mongodb://localhost:4100/platform`;
console.log("MONGO_URL");
console.log("MONGO_URL");
console.log("MONGO_URL");
console.log(MONGO_URL);
console.log("MONGO_URL");
console.log("MONGO_URL");
console.log("MONGO_URL");

// Connect to mongoDB
module.exports = (() => {

    const db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        // CONNECTED TO MONGODB SERVER
        console.log(`Connected to mongod server, path=${MONGO_URL}`);
    });

    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

module.exports.schema = {
    Interest: require('./interest'),
    Diving: require('./diving'),

    DiveCenter: require('./dive-center'),
    DivePoint: require('./dive-point'),
    DiveSite: require('./dive-site'),

    Image: require('./image'),
    ImageContent: require('./image-content'),

    Institution: require('./institution'),
    Instructor: require('./instructor'),
    License: require('./license'),

    User: require('./user'),
}