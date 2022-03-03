const {
    User,
    Review,
    Forum,
    DivingHistory,
    DiveCenter,
    DiveSite,
    DivePoint,
    Subscribe
} = require('../../model').schema;

module.exports = {

    Query: {
        async getForums(parent, args, context, info) {
            console.log(`query | getForums: context=${JSON.stringify(context)}`)
            return await Forum.find()
                .lean()
        },

    },

    Mutation: {
        async upsertForum(parent, args, context, info) {
            console.log(`mutation | upsertForum: args=${JSON.stringify(args)}`)

            let forum = null
            const isNewForum = !args.input._id

            if (!isNewForum) {
                forum = await Forum.findById(args.input._id)

            } else {
                forum = new Forum(args.input)
            }
            Object.assign(forum, args.input)

            await forum.save()
            return forum
        },
    },
};