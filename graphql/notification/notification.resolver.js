const {
    Diving,
    DivePoint,
    DiveSite,
    DiveCenter,
    Image,
    User,
    Review,
    Like,
    Subscribe,
    Notification
} = require('../../model').schema;

module.exports = {

    //TODO refactor relocate into different resolver

    Query: {
        async getNotifications(parent, args, context, info) {
            let user = await User.findOne({ uid: context.uid })
                .lean()

            return await Notification.find({ userId: user._id })
                .lean()
                .skip(args.skip)
                .limit(args.limit)
                .sort('-createdAt')
        },
    },

    Mutation: {
        async read(parent, args, context, info) {
            console.log(`mutation | read: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .lean()

            await Notification.updateOne({ userId: user._id, _id: args.notificationId }, { read: true })
            return {
                success: true
            }
        },

        async readAll(parent, args, context, info) {
            console.log(`mutation | readAll: args=${JSON.stringify(args)} context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid })
                .lean()

            await Notification.updateMany({ userId: user._id }, { read: true })
            return {
                success: true
            }
        },
    },
}