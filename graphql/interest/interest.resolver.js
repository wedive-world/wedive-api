const schema = require('../../model').schema;

const Interest = schema.Interest

const translator = require('../common/util/translator')

module.exports = {
    Query: {
        async getInterestById(parent, args, context, info) {
            let languageCode = context.languageCode
            console.log(`query | getInterestById: languagecode=${JSON.stringify(languageCode)} args=${JSON.stringify(args)}`)

            let interest = await Interest.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(interest, languageCode)
        },

        async getAllInterests(parent, args, context, info) {
            let languageCode = context.languageCode

            console.log(`query | getAllInterests: languagecode=${JSON.stringify(languageCode)}`)

            let interests = await Interest.find((args.type) ? { type: args.type } : { })
                .lean()

            return interests.map(interest => translator.translateOut(interest, languageCode))
        },

        async searchInterestsByName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | searchInterestsByName: args=${JSON.stringify(args)}`)

            let param = {
                $and: [
                    { $text: { $search: args.query } }
                ]
            }

            if (args.type) {
                param.$and.push({
                    type: args.type
                })
            }

            console.log(`query | searchInterest: param=${JSON.stringify(param)}`)

            let interests = await Interest.find(param)
                .lean()

            console.log(`query | searchInterest: result=${JSON.stringify(interests)}`)

            return interests.map(interest => translator.translateOut(interest, languageCode))
        }
    },

    Mutation: {
        async upsertInterest(parent, args, context, info) {

            console.log(`mutation | createInterest: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode

            let interest = null

            if (!args.input._id) {
                interest = new Interest(args.input)

            } else {
                interest = await Interest.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof interest[key] == typeof args.input[key])
                    .forEach(key => { interest[key] = args.input[key] })

                interest.updatedAt = Date.now()
            }

            interest = translator.translateIn(interest, args.input, languageCode)
            await interest.save()

            return translator.translateOut(interest, languageCode)
        },
        
        async deleteInterestById(parent, args, context, info) {
            let result = await Interest.deleteOne({ _id: args._id })
            console.log(`mutation | deleteInterestById: result=${JSON.stringify(result)}`)
            return args._id
        },
    },
};