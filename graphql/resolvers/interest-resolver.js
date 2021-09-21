const schema = require('../../model');
const divingInterest = require('../../model/diving/interest/divingInterest');

const DivingInterest = schema.DivingInterest

module.exports = {
    Query: {
        async divingInterests(parent, args, context, info) {

            console.log(`divingInterests: args=${args}`)

            let divingInterests = await DivingInterest.find()
            let languageCode = args.languageCode

            return divingInterests.map(divingInterest => divingInterest.title = divingInterest.title[languageCode])
        },
    },

    // Mutation: {
    //     async user(parent, args, context, info) {
    //         return await new User(args).save()
    //     },
    // },
};