const schema = require('../../model').schema;

const Interest = schema.Interest

const translator = require('../common/util/translator')

module.exports = {
    Query: {
        async getInterestById(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'
            console.log(`query | getInterestById: countrycode=${JSON.stringify(countryCode)} args=${JSON.stringify(args)}`)

            let interest = await Interest.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(interest, countryCode)
        },

        async getAllInterests(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'

            console.log(`query | getAllInterests: countrycode=${JSON.stringify(countryCode)}`)

            let interests = await Interest.find((args.type) ? { type: args.type } : { })
                .lean()

            return interests.map(interest => translator.translateOut(interest, countryCode))
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
                .lean()

            console.log(`query | searchInterest: result=${JSON.stringify(interests)}`)

            return interests.map(interest => translator.translateOut(interest, countryCode))
        }
    },

    Mutation: {
        async upsertInterest(parent, args, context, info) {

            console.log(`mutation | createInterest: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'

            let interest = null

            if (!args.input._id) {
                interest = new Interest(args.input)

            } else {
                interest = await Interest.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == args.input[key])
                    .forEach(key => { interest[key] = args.input[key] })

                interest.updatedAt = Date.now()
            }

            interest = translator.translateIn(interest, args.input, countryCode)
            await interest.save()

            return translator.translateOut(interest, countryCode)
        },
        
        async deleteInterestById(parent, args, context, info) {
            let result = await Interest.deleteOne({ _id: args._id })
            console.log(`mutation | deleteInterestById: result=${JSON.stringify(result)}`)
            return args._id
        },
    },
};