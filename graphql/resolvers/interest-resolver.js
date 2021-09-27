const schema = require('../../model').schema;

const Interest = schema.Interest

module.exports = {
    Query: {
        async interests(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'

            console.log(`query | interests: countrycode=${JSON.stringify(countryCode)}`)
            console.log(`query | interests: args=${JSON.stringify(args)}`)

            let param = {}

            if (args.type) {
                param.type = args.type
            }

            let interests = await Interest.find(param)

            interests = interests.map(interest => {
                interest = JSON.parse(JSON.stringify(interest))
                interest.title = interest.titleTranslation[countryCode]
                return interest
            })

            return interests
        },

        async searchInterest(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            console.log(`query | searchInterest: args=${JSON.stringify(args)}`)

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

            let result = await Interest.find(param)
            console.log(`query | searchInterest: result=${JSON.stringify(result)}`)

            return result.map(interest => {
                interest = JSON.parse(JSON.stringify(interest))
                interest.title = interest.titleTranslation[countryCode]
                return interest
            })
        }
    },

    Mutation: {
        async interest(parent, args, context, info) {

            console.log(`mutation | interest: args=${JSON.stringify(args)}`)

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
    },
};