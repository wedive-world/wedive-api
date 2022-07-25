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

    Query: {
        async getReportCodes(parent, args, context, info) {
            return [
                ['0', '음란물이에요'],
                ['1', '불법내용이 포함되어있어요'],
                ['2', '정치적인 글이에요'],
                ['3', '종교적인 글이에요'],
                ['4', '특정인을 혐오해요'],
                ['5', '욕설이 포함되어요'],
                ['6', '도배 글이에요'],
                ['7', '광고 글이에요'],
                ['8', '사기 글이에요'],
            ]
        }
    },

    Mutation: {
        report: async (parent, args, context, info) => {
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