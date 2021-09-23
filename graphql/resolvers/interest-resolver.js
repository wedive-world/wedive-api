const schema = require('../../model').schema;

const Interest = schema.Interest

module.exports = {
    Query: {
        async interests(parent, args, context, info) {

            console.log(`query | interests: args=${JSON.stringify(args)}`)

            let param = {}

            if (args.type) {
                param.type = args.type
            }

            let interests = await Interest.find(param)

            interests = interests.map(interest => {
                interest = JSON.parse(JSON.stringify(interest))
                interest.title = interest.title[args.languageCode]
                return interest
            })

            return interests
        },

        async searchInterest(parent, args, context, info) {

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
                interest.title = interest.title[args.languageCode]
                return interest
            })
        }
    },

    Mutation: {
        async interest(parent, args, context, info) {

            console.log(`mutation | interest: args=${JSON.stringify(args)}`)
            let interest = await Interest.findOne({
                title: {
                    [args.languageCode]: args.title
                }
            })

            let param = {
                title: {
                    [args.languageCode]: args.title
                },
                type: args.type,
                iconType: args.iconType,
                iconName: args.iconName,
                iconColor: args.iconColor,
                iconUrl: args.iconUrl,
            }

            let result;
            if (interest) {
                let inputKey = Object.keys(param)
                Object.keys(interest)
                    .filter(key => inputKey.includes(key))
                    .forEach(key => {
                        interest[key] = param[key]
                    })

                result = await interest.save()
            } else {
                result = await new Interest(param).save()
            }

            result.title = result.title[args.languageCode]
            return result
        },
    },
};