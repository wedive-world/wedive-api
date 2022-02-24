const {
    SearchSuggestion,

    DiveCenter,
    DiveSite,
    DivePoint,
    Interest
} = require('../../model').schema;

const {
    createMongooseSearchQuery
} = require('../../util/search-helper')
module.exports = {

    Query: {
        async getAllSearchSuggestions(parent, args, context, info) {
            console.log(`query | getAllSearchSuggestions: context=${JSON.stringify(context)}`)
            return await SearchSuggestion.find()
                .select('word')
                .distinct('word')
        },

        async findSearchSuggestions(parent, args, context, info) {
            console.log(`query | findSearchSuggestions: context=${JSON.stringify(context)}`)

            return await SearchSuggestion.find(createMongooseSearchQuery(args.query))
                .lean()
                .select('word')
                .distinct('word')
        },
    },

    Mutation: {
        async updateSearchSuggestions(parent, args, context, info) {
            console.log(`mutation | updateSearchSuggestions: args=${JSON.stringify(args)}`)

            await SearchSuggestion.deleteMany()
            const modelList = [DiveCenter, DiveSite, DivePoint, Interest]

            for (model of modelList) {
                let wordList = await extractWordList(model)
                await SearchSuggestion.insertMany(
                    wordList.map(word => {
                        return {
                            word: word
                        }
                    }),
                    { ordered: false }
                )
            }

            return {
                success: true
            }
        }
    },
};

async function extractWordList(model) {

    let wordList = []

    let nameList = await model.find()
        .lean()
        .select('nameTranslation.ko')
        .distinct('nameTranslation.ko')

    wordList = wordList.concat(nameList)

    let titleList = await model.find()
        .lean()
        .select('titleTranslation.ko')
        .distinct('titleTranslation.ko')

    wordList = wordList.concat(titleList)

    let addressList = await model.find()
        .lean()
        .select('addressTranslation.ko')
        .distinct('addressTranslation.ko')

    addressList.forEach(address => {
        if (!address || address.length == 0) {
            return;
        }

        address.split(' ').forEach(addressWord => wordList.push(addressWord))
    })

    console.log(`wordList=${wordList}`)
    return wordList
}