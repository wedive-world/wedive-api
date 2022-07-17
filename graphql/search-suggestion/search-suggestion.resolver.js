const {
    SearchSuggestion,

    DiveCenter,
    DiveSite,
    DivePoint,
    Interest,
    DiveShop
} = require('../../model').schema;

const {
    createMongooseSearchQuery
} = require('../../util/search-helper')
module.exports = {

    Query: {
        async getAllSearchSuggestions(parent, args, context, info) {
            // console.log(`query | getAllSearchSuggestions: context=${JSON.stringify(context)}`)
            return await SearchSuggestion.find()
                .select('word')
                .distinct('word')
        },

        async findSearchSuggestions(parent, args, context, info) {
            // console.log(`query | findSearchSuggestions: context=${JSON.stringify(context)}`)

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
            const modelList = [DiveCenter, DiveSite, DivePoint, Interest, DiveShop]
            const fieldList = [
                'name',
                'nameTranslation.ko',
                'placeName',
                'titleTranslation.ko',
                'addressTranslation.ko',
                'address',
                'placeAddress',
                'aliasesStringTranslation.ko',
                'searchTermsStringTranslation.ko',
            ]

            for (model of modelList) {
                for (let field of fieldList) {
                    let wordList = await extractWordList(model, field)
                    if (!wordList || wordList.length < 1) {
                        continue
                    }

                    // console.log(`model=${model} field=${field} wordList=${wordList}`)

                    await SearchSuggestion.insertMany(
                        wordList.map(word => {
                            return {
                                word: word
                            }
                        }),
                        { ordered: false }
                    )
                }
            }

            return {
                success: true
            }
        }
    },
};

async function extractWordList(model, field) {

    let valueList = await model.find()
        .lean()
        .select(field)
        .distinct(field)

    let wordList = []
    valueList.forEach(value => {
        if (!value || value.length == 0) {
            return
        }

        let split = value.split(/[\s,]/)
        if (!split || split.length < 2) {
            wordList.push(value)
        } else {
            split.forEach(valueWord => wordList.push(valueWord))
        }
    })

    // return valueList.concat(wordList)
    return wordList
}