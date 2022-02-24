const Inko = require('inko');
var inko = new Inko()

module.exports.createMongooseSearchQuery = function (query) {
    return createWrongKoreanSearchQuery(query)
}

function createDefaultSearchQuery(query) {

}

function createWrongKoreanSearchQuery(query) {
    return {
        $or: [
            { $text: { $search: query } },
            { $text: { $search: inko.en2ko(query) } },
            { $text: { $search: inko.ko2en(query) } }
        ]
    }
}