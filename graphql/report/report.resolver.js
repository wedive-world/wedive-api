const {
    User,
    Report
} = require('../../model').schema;

const Mongoose = require('mongoose');
const NoticeAgendaTypeID = '624017f9abe6e467bdc55cb4'
const NoticeAgendaType = Mongoose.Types.ObjectId(NoticeAgendaTypeID)

module.exports = {
    Diving: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },
    Agenda: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },
    User: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },
    Community: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },
    Instructor: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },
    Review: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        }
    },

    Mutation: {
        async createReport(parent, args, context, info) {
            console.log(`mutation | createReport: args=${JSON.stringify(args)}`)

            if (!context.uid) {
                return {
                    success: false
                }
            }

            const user = await User.find({ uid: context.uid })
                .lean()
                .select('_id')

            let input = args.input
            input.userId = user._id

            await Report.findOneAndUpdate(
                { userId: user._id, targetId: input.targetId },
                input,
                { upsert: true }
            )

            return {
                success: true
            }
        },
    }
}