const {
    Diving,
    DivePoint,
    DiveSite,
    DiveCenter,
    Image,
    User,
    Review,
    Like,
    Subscribe
} = require('../../model').schema;

module.exports = {

    //TODO refactor relocate into different resolver

    Query: {
        async getNotifications(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
            return await Like.findOne({ userId: user._id }).lean()
        },
    },

    Mutation: {
        async read(parent, args, context, info) {
            console.log(`mutation | view: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)
            await getModel(args.targetType).findOneAndUpdate({ _id: args.targetId }, { $inc: { 'views': 1 } })
            return true
        },

        async readAll(parent, args, context, info) {
            console.log(`mutation | like: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })

            let result = await Like.findOneAndUpdate(
                {
                    userId: user ? user._id : "6188c5ad4c8a87c504b15501",
                    targetId: args.targetId
                },
                [{ $set: { value: { $eq: [false, '$value'] } } }],
                {
                    upsert: true,
                    new: true
                }
            )

            console.log(`mutation | like: result=${JSON.stringify(result)}`)

            await getModel(args.targetType).findOneAndUpdate(
                { _id: args.targetId },
                { $inc: { 'likes': result.value ? 1 : -1 } }
            )
            return result.value
        },
    },
}