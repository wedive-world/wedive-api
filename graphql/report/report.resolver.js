const {
    User,
    Report
} = require('../../model').schema;

const {
    getUserIdByUid
} = require('../../controller/user-controller')

module.exports = {
    Diving: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedDiving(context.uid, parent)
        }
    },
    Agenda: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedAuthor(context.uid, parent)
        }
    },
    User: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedByUid(context.uid, parent._id)
        }
    },
    Community: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedByUid(context.uid, parent._id)
        }
    },
    Instructor: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedByUid(context.uid, parent._id)
        }
    },
    Review: {
        async reportCount(parent, args, context, info) {
            return await Report.count({ targetId: parent._id })
        },
        isBlocked: async (parent, args, context, info) => {
            return await isBlockedAuthor(context.uid, parent)
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
            console.log(`mutation | report: args=${JSON.stringify(args)}`)
            await report(context.uid, args.targetId, args.reason)

            return {
                success: true
            }
        },
        unblock: async (parent, args, context, info) => {
            console.log(`mutation | unblock: args=${JSON.stringify(args)}`)
            await unblock(context.uid, args.targetId)

            return {
                success: true
            }
        },
    }
}

async function isBlockedAuthor(uid, agenda) {
    if (!uid) {
        throw new Error('uid is null')
    }

    let userId = await getUserIdByUid(uid)
    let isBlockedAgenda = await isBlockedByUserId(userId, agenda._id)
    if (isBlockedAgenda) {
        return true
    }

    let isBlockedAuthor = await isBlockedByUserId(userId, agenda.author)
    if (isBlockedAuthor) {
        return true
    }

    return false
}

async function isBlockedDiving(uid, diving) {
    if (!uid) {
        throw new Error('uid is null')
    }

    let userId = await getUserIdByUid(uid)
    let isBlockedDiving = await isBlockedByUserId(userId, diving._id)
    if (isBlockedDiving) {
        return true
    }

    let isBlockedHostUser = await isBlockedByUserId(userId, diving.hostUser)
    if (isBlockedHostUser) {
        return true
    }

    //TODO participant check

    return false
}

async function isBlockedByUid(uid, targetId) {
    if (!uid) {
        throw new Error('uid is null')
    }

    let userId = await getUserIdByUid(uid)
    return isBlockedByUserId(userId, targetId)
}

async function isBlockedByUserId(userId, targetId) {

    if (!userId) {
        throw new Error('user not found')
    }

    if (!targetId) {
        throw new Error('targetId is null')
    }

    let count = await Report.count({
        userId: userId,
        targetId: targetId
    })

    return count > 0
}

async function report(uid, targetId, reason) {
    if (!uid) {
        throw new Error('uid is null')
    }

    let userId = await getUserIdByUid(uid)

    if (!userId) {
        throw new Error('user not found')
    }

    if (!targetId) {
        throw new Error('targetId is null')
    }

    await Report.create({
        userId: userId,
        targetId: targetId,
        reason: reason
    })
}

async function unblock(uid, targetId) {
    if (!uid) {
        throw new Error('uid is null')
    }

    let userId = await getUserIdByUid(uid)

    if (!userId) {
        throw new Error('user not found')
    }

    if (!targetId) {
        throw new Error('targetId is null')
    }

    await Report.findOneAndDelete({
        userId: userId,
        targetId: targetId
    })
}