const schema = require('../../model').schema;

const Interest = schema.Interest

module.exports = {
    Query: {
        async interests(parent, args, context, info) {

            console.log(`query | interests: args=${JSON.stringify(args)}`)

            let interests = await Interest.find({
                type: args.type
            })

            let result = interests.map(interest => {
                interest.title = interest.title[args.languageCode]
                return interest
            })
            console.log(`result: result=${JSON.stringify(result)}`)

            return result
        },
    },

    Mutation: {
        async interest(parent, args, context, info) {

            console.log(`mutation | interest: args=${JSON.stringify(args)}`)
            let interest = await Interest.findOne({
                title: {
                    [args.languageCode]: args.title
                }
            })

            let input = {
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
                let inputKey = Object.keys(input)
                Object.keys(interest)
                    .filter(key => inputKey.includes(key))
                    .forEach(key => {
                        interest[key] = input[key]
                    })

                result = await interest.save()
            } else {
                result = await new Interest(input).save()
            }

            result.title = result.title[args.languageCode]
            return result
        },
    },
};