const mongoose = require('mongoose');

switch (process.env.NODE_ENV) {
    case 'development':
    case 'production':
        require('dotenv').config({ path: './wedive-secret/db-config.env' })
        break;

    case 'local':
        require('dotenv').config({ path: './wedive-secret/local/db-config.env' })
        break;
}

const { DB_HOST } = process.env;

// Connect to mongoDB
module.exports = (() => {

    console.log(`trying to connect ${DB_HOST}...`)

    const db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        // CONNECTED TO MONGODB SERVER
        console.log(`Connected to mongod server, path=${DB_HOST}`);
    });

    mongoose.connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        directConnection: true
    })
})

module.exports.schema = {
    Interest: require('./interest'),
    Diving: require('./diving'),

    DivePoint: require('./dive-point'),
    DiveSite: require('./dive-site'),
    DiveCenter: require('./dive-center'),
    Diving: require('./diving'),

    Image: require('./image'),
    ImageContent: require('./image-content'),

    Institution: require('./institution'),
    Instructor: require('./instructor'),
    License: require('./license'),

    User: require('./user'),
    InstructorVerification: require('./instructor-verification'),

    Highlight: require('./highlight'),

    Product: require('./product'),

    Like: require('./like'),
    Dislike: require('./dislike'),
    Subscribe: require('./subscribe'),

    Review: require('./review'),
    Notification: require('./notification'),
    Recommendation: require('./recommendation'),
    SearchSuggestion: require('./search-suggestion'),
}