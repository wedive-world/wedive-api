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
    Instructor,
    Notification
} = require('../../model').schema;

module.exports = {
    NotificationTarget: {
        async __resolveType(obj, context, info) {
            if (obj.hostUser) {
                return 'Diving'
            } else if (obj.diveSiteId) {
                return 'DivePoint'
            } else if (obj.webPageUrl || obj.email || obj.phoneNumber || obj.educationScore) {
                return 'DiveCenter'
            } else if (obj.user) {
                return 'Instructor'
            } else if (obj.uid) {
                return 'User'
            } else {
                return 'DiveSite'
            }
        }
    },

    Notification: {
        async target(parent, args, context, info) {
            return await getModel(parent.targetType).findById(parent.targetId)
                .lean()
        },

        async subject(parent, args, context, info) {
            return await getModel(parent.subjectType).findById(parent.subjectId)
                .lean()
        }
    },

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

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diving':
            return Diving

        case 'instructor':
            return Instructor

        case 'user':
            return User
    }
}