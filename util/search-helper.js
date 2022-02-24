const Inko = require('inko');
var inko = new Inko()
const Hangul = require('hangul-js');

module.exports.createMongooseSearchQuery = function (query) {
    let english = /^[A-Za-z0-9]*$/;
    if (english.test(query)) {
        let translatedKor = inko.en2ko(query)
        if (Hangul.isCompleteAll(translatedKor)) {
            return createSearchQueryParams(translatedKor)
        }
    }

    return createSearchQueryParams(query)
}

function createSearchQueryParams(query) {
    return { $text: { $search: query } }
}