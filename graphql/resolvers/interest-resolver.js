const schema = require('../../model').schema;

const Interest = schema.Interest

const translator = require('./util/translator')

module.exports = {
    Query: {
        async getInterestById(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'
            let interest = await Interest.find({
                _id: args._id
            })

            return translator.interestTranslateOut(interest, countryCode)
        },

        async getAllInterests(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'

            console.log(`query | getAllInterests: countrycode=${JSON.stringify(countryCode)}`)
            console.log(`query | getAllInterests: args=${JSON.stringify(args)}`)

            let param = {}

            if (args.type) {
                param.type = args.type
            }

            let interests = await Interest.find(param)
            return interests.map(interest => translator.interestTranslateOut(interest, countryCode))
        },

        async searchInterestsByName(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
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
            console.log(`query | searchInterest: result=${JSON.stringify(result)}`)

            return interests.map(interest => translator.interestTranslateOut(interest, countryCode))
        }
    },

    Mutation: {
        async upsertInterest(parent, args, context, info) {

            console.log(`mutation | createInterest: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'

            let interest = null

            if (args.input._id) {
                interest = await Interest.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key])
                    .forEach(key => { interest[key] = args.input[key] })

                interest.updatedAt = Date.now()

            } else {
                interest = new Interest(args.input)

                interest.titleTranslation = new Map()
                interest.titleTranslation.set(countryCode, args.input.title)
            }

            let result = await interest.save()

            return result
        },
        async deleteInterestById(parent, args, context, info) {
            let result = await Interest.deleteOne({ _id: args._id })
            console.log(`mutation | deleteInterestById: result=${JSON.stringify(result)}`)
            return args._id
        },
    },
};