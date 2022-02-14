const {
    Diving,
    User
} = require('../../model').schema;

const notificationManager = require('../../controller/notification-manager')
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const chatServiceProxy = new ChatServiceProxy()

const {
    createHistoryFromDivingComplete
} = require('../../controller/diving-history-manager')

module.exports = {

    Query: {
        async getAllDivings(parent, args, context, info) {

            return await Diving.find()
                .lean()
        },

        async getDivingById(parent, args, context, info) {
            return await Diving.findOne({ _id: args._id })
                .lean()
        },

        async getDivingsByHostUserId(parent, args, context, info) {
            return await Diving.find({ hostUser: args.hostUserId })
                .lean()
        },

        async getDivingsByCurrentUser(parent, args, context, info) {
            let userUid = context.uid
            let user = await User.findOne({ uid: userUid })
            return await Diving.find({
                participant: {
                    user: {
                        '_id': user._id
                    }
                }
            })
                .skip(args.skip)
                .limit(args.limit)
        },

        async getDivingByChatRoomId(parent, args, context, info) {
            return await Diving.findOne({ chatRoomId: args.chatRoomId })
                .lean()
        },
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)

            let diving = null
            const isNewDiving = !args.input._id

            if (isNewDiving) {
                diving = new Diving(args.input)
                diving.hostUser = await User.findOne({ uid: context.uid })
                    .select('_id')
                    .lean()

            } else {
                diving = await Diving.findOne({ _id: args.input._id })
                    .populate('hostUser')

                if (context.uid != diving.hostUser.uid) {
                    console.log(`mutation | upsertDiving: invalid user`)
                    return null
                }
                Object.assign(diving, args.input)

                diving.updatedAt = Date.now()
            }

            let chatRoomId = await chatServiceProxy.createChatRoom(diving.title, context.idToken)

            diving.chatRoomId = chatRoomId
            await diving.save()

            if (isNewDiving) {
                await notificationManager.onDivingCreated(diving)
            }

            return diving
        },

        async deleteDivingById(parent, args, context, info) {
            let result = await Diving.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)
            return args._id
        },

        async joinDiving(parent, args, context, info) {
            console.log(`mutation | joinDiving: args=${JSON.stringify(args)}`)

            let diving = await Diving.findOne({ _id: args.divingId })
                .populate('participants.user', 'hostUser')

            if (diving.status != 'searchable') {
                return {
                    success: false,
                    reason: 'publicEnded'
                }
            }

            let userUid = context.uid
            if (diving.hostUser.uid == userUid) {
                return {
                    success: false,
                    reason: 'hostCannotApply'
                }
            }

            let userExist = diving.participants
                .filter(participant => participant.user)
                .map(participant => participant.user)
                .find(user => user.uid == userUid)

            if (userExist) {
                return {
                    success: false,
                    reason: 'alreadyApplied'
                }
            }

            let user = await User.findOne({ uid: userUid })
                .lean()

            diving.participants.push({
                user: user._id,
                status: 'applied',
                name: user.nickName,
                birth: user.birth,
                gender: user.gender
            })

            await diving.save()
            await notificationManager.onNewParticipantAtDiving(diving, user)

            return {
                success: true
            }
        },

        async acceptParticipant(parent, args, context, info) {
            console.log(`mutation | acceptParticipant: args=${JSON.stringify(args)}`)

            let diving = await Diving.findOne({ _id: args.divingId })
                .populate('participants.user', 'hostUser')

            await updateParticipantStatus(diving, context.uid, args.userId, 'joined')
            await notificationManager.onParticipantJoinedDiving(diving, args.userId)

            let user = await User.findById(args.userId)
            let inviteResult = await chatServiceProxy.invite({
                roomId: args.roomId,
                uid: user.uid
            }, context.idToken)

            console.log(`diving-resolver | acceptParticipant: inviteResult=${JSON.stringify(inviteResult)}`)
            return {
                success: true
            }
        },

        async kickParticipant(parent, args, context, info) {
            console.log(`mutation | kickParticipant: args=${JSON.stringify(args)}`)

            let diving = await Diving.findOne({ _id: args.divingId })
                .populate('participants.user', 'hostUser')

            await updateParticipantStatus(diving, context.uid, args.userId, 'banned')
            let user = await User.findById(args.userId)
            let kickResult = await chatServiceProxy.kick({
                roomId: args.roomId,
                uid: user.uid
            }, context.idToken)

            console.log(`diving-resolver | kickUser: kickReesult=${JSON.stringify(kickResult)}`)
            return {
                success: true
            }
        },
        async completeDivingIfExist(parent, args, context, info) {
            console.log(`mutation | completeDivingIfExist: args=${JSON.stringify(args)}`)
            await completeDivingIfExist()
            return {
                success: true
            }
        },
        async prepareDivingIfExist(parent, args, context, info) {
            console.log(`mutation | prepareDivingIfExist: args=${JSON.stringify(args)}`)
            await prepareDivingIfExist()
            return {
                success: true
            }
        },
    },
};

async function prepareDivingIfExist() {
    let after3Days = new Date()
    after3Days.setDate(after3Days.getDate() + 1)

    let after3Days10Minutes = new Date(after3Days.getTime() + 10 * 60 * 1000)

    let divings = await Diving.find({
        startedAt: {
            $and: [
                { $gte: after3Days },
                { $lte: after3Days10Minutes }
            ]
        }
    }).lean()

    for (let diving of divings) {
        await notificationManager.onDivingPreparation(diving)
    }
}

async function completeDivingIfExist() {
    let divingIds = await Diving.find({
        status: ['searchable', 'publicEnded'],
        finishedAt: { $lte: Date.now() }
    })
        .select('_id')
        .lean()

    for (let divingId of divingIds) {
        await completeDiving(divingId)
    }
}

async function completeDiving(divingId) {

    let diving = await Diving.findOne({ _id: divingId })
        .populate('hostUser')

    if (diving.status == 'divingComplete') {
        return {
            success: false,
            reason: 'Diving is already completed'
        }
    }

    diving.status = 'divingComplete'
    await diving.save()

    if (diving.hostUser) {
        await User.findOneAndUpdate(
            { _id: diving.hostUser._id },
            { $inc: { divingHostCount: 1 } }
        )
    }

    if (diving.participant && diving.participant.length > 0) {
        await User.findManyAndUpdate(
            { _id: diving.participant.map(participant => participant.user) },
            { $inc: { divingParticipantCount: 1 } }
        )
    }

    await createHistoryFromDivingComplete(divingId)
}

async function updateParticipantStatus(diving, userUid, participantId, participantStatus) {

    if (diving.status != 'searchable') {
        return {
            success: false,
            reason: 'publicEnded'
        }
    }

    if (diving.hostUser.uid != userUid) {
        return {
            success: false,
            reason: 'onlyHostCanUpdate'
        }
    }

    let participant = diving.participants
        .find(participant => participant.user && participant.user._id == participantId)

    if (!participant) {
        return {
            success: false,
            reason: 'userNotFoundInParticipants'
        }
    }

    if (participant.status == participantStatus) {
        return {
            success: false,
            reason: 'alreadyUpdated'
        }
    }

    participant.status = participantStatus
    await diving.save()
}