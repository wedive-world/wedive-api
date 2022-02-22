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

            let forums = await Forum.find()
                .limit(2)
                .lean()

            let user = await User.findOne({ uid: context.uid })
                .populate('interests')
                .limit(2)
                .lean()

            let interestForums = user.interests
                .map(interest => {
                    return {
                        _id: interest._id,
                        name: interest.title
                    }
                })

            let lastDivingHistories = await DivingHistory.find({ user: user._id })
                .sort('-finishedAt')
                .limit(2)

            let divingHistoriesForum = []
            for (let divingHistory of lastDivingHistories) {
                if (divingHistory.diveSites && divingHistory.diveSites.length > 0) {
                    let diveSite = await DiveSite.findById(divingHistory.diveSites[0])
                    divingHistoriesForum.push(diveSite)

                } else if (divingHistory.divePoints && divingHistory.divePoints.length > 0) {
                    let divePoint = await DivePoint.findById(divingHistory.divePoints[0])
                    divingHistoriesForum.push(divePoint)

                } else if (divingHistory.diveCenters && divingHistory.diveCenters.length > 0) {
                    let diveCenter = await DiveCenter.findById(divingHistory.diveCenters[0])
                    divingHistoriesForum.push(diveCenter)
                }
            }

            let subscriptionForum = []
            let subscriptionIds = await Subscribe.find({ userId: user._id })
                .select('targetId')

            let subscribedDiveSites = await DiveSite.find({ _id: { $in: subscriptionIds } })
                .lean()
            subscriptionForum = subscriptionForum.concat(subscribedDiveSites)
            
            let subscribedDivePoints = await DivePoint.find({ _id: { $in: subscriptionIds } })
                .lean()
            subscriptionForum = subscriptionForum.concat(subscribedDivePoints)
            
            let subscribedDiveCenters = await DiveCenter.find({ _id: { $in: subscriptionIds } })
                .lean()
            subscriptionForum = subscriptionForum.concat(subscribedDiveCenters)

            return forums.concat(interestForums)
                .concat(subscriptionForum)
                .concat(divingHistoriesForum)
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