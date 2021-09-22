const schema = require('../../model');

const Interest = schema.Interest

module.exports = {
    Query: {
        async interests(parent, args, context, info) {

            console.log(`query | interests: args=${args}`)

            let interests = await Interest.find({
                type: args.type
            })
            let languageCode = args.languageCode

            return interests.map(interest => interest.title = interest.title[languageCode])
        },
    },

    Mutation: {
        async interest(parent, args, context, info) {

            console.log(`mutation | interest: args=${args}`)

            let input = {
                title: {},
                type: args.type,
                iconType: args.iconType,
                type: args.iconName,
                iconColor: args.iconColor,
                iconUrl: args.iconUrl,
            }

            input.title[args.languageCode] = args.title

            return await new Interest(input).save()
        },
    },
};