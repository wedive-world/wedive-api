const {
    User,
    Review,
    Forum,
    DivingHistory,
    DiveCenter,
    DiveSite,
    DivePoint,
    Subscribe,
    Agenda
} = require('../../model').schema;

const Mongoose = require('mongoose');

module.exports = {

    Query: {
        async getForums(parent, args, context, info) {
            console.log(`query | getForums: context=${JSON.stringify(context)}`)
            return await Forum.find()
                .sort('priority')
                .lean()
        },

        async getHotHashTags(parent, args, context, info) {
            console.log(`query | getHotHashTags: args=${JSON.stringify(args)}`)
            let date = new Date()
            date.setDate(date.getDate() - args.days);
            let hashTags = await Agenda.aggregate([
                { $match: { createdAt: { $gte: date } } },
                { $unwind: "$hashTags" },
                { $sortByCount: "$hashTags" }
            ])
                .limit(args.limit)

            return hashTags.map(hashTag => hashTag._id.name)
        },

        async getHotHashTagsById(parent, args, context, info) {
            console.log(`query | getHotHashTagsById: args=${JSON.stringify(args)}`)
            let date = new Date()
            date.setDate(date.getDate() - args.days);
            let hashTags = await Agenda.aggregate([
                {
                    $match: {
                        targetId: Mongoose.Types.ObjectId(args.targetId),
                        createdAt: { $gte: date }
                    }
                },
                { $unwind: "$hashTags" },
                { $sortByCount: "$hashTags" }
            ])
                .limit(args.limit)

            return hashTags.map(hashTag => hashTag._id.name)
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