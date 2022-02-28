const {
    Diving,
    DivingParticipant,
    User
} = require('../../model').schema;

const notificationManager = require('../../controller/notification-manager')
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const chatServiceProxy = new ChatServiceProxy()

const {
    createHistoryFromDivingComplete
} = require('../../controller/diving-history-manager')

module.exports = {
    Diving: {
        async participants(parent, args, context, info) {
            const divintParticipants = await DivingParticipant.find({ diving: parent._id })
                .lean()

            return parent.participants
                .concat(divingParticipants)
        }
    },

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

                let userIds = args.input.participants
                    .filter(participant => participant.user)
                    .map(participant => participant.user)

                if (userIds && userIds.length > 0) {
                    let memberUids = await User.find({ _id: userIds })
                        .select('uid')
                        .lean()
                        .map(user => user.uid)

                    let chatRoomId = await chatServiceProxy.createChatRoom(diving.title, memberUids, usercontext.idToken)
                    diving.chatRoomId = chatRoomId
                }

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

            const diving = await Diving.findOne({ _id: args.divingId })
                .populate('hostUser')
                .lean()

            if (diving.status != 'searchable') {
                return {
                    success: false,
                    reason: 'publicEnded'
                }
            }

            const userUid = context.uid
            if (diving.hostUser.uid == userUid) {
                return {
                    success: false,
                    reason: 'hostCannotApply'
                }
            }

            const user = await User.findOne({ uid: context.uid })
                .lean()

            await updateParticipantStatus(diving._id, user._id, 'applied')
            await notificationManager.onParticipantJoinedDiving(diving._id, diving.hostUser._id, user._id)

            return {
                success: true
            }
        },

        async acceptParticipant(parent, args, context, info) {
            console.log(`mutation | acceptParticipant: args=${JSON.stringify(args)}`)

            const currentUser = await User.findOne({ uid: context.uid })
                .lean()

            if (currentUser._id != diving.hostUser._id) {
                return {
                    success: false,
                    reason: 'onlyHostCanAccept'
                }
            }

            const diving = await Diving.findById(args.divingId)
                .populate('participants.user', 'hostUser')
                .lean()

            if (!diving) {
                return {
                    success: false,
                    reason: "unkownDiving"
                }
            }

            let participant = await User.findById(args.userId)
            if (!participant) {
                return {
                    success: false,
                    reason: "unknownParticipant"
                }
            }

            if (!diving.chatRoomId) {
                let chatRoomId = await chatServiceProxy.createChatRoom(diving.title, [participant.uid], context.idToken)
                console.log(`diving-resolver | acceptParticipant: chatRoomId=${JSON.stringify(chatRoomId)}`)
                await Diving.findByIdAndUpdate(diving._id, { chatRoomId: chatRoomId })

            } else {
                let inviteResult = await chatServiceProxy.invite({
                    roomId: args.roomId,
                    uid: participant.uid
                }, context.idToken)

                console.log(`diving-resolver | acceptParticipant: inviteResult=${JSON.stringify(inviteResult)}`)
            }

            await updateParticipantStatus(diving._id, participant._id, 'joined')

            let participantIds = diving.participants
                .filter(participant => participant.user)
                .map(user => user._id)

            participantIds = participantIds.concat(
                await DivingParticipant.find({ diving: diving._id })
                    .select('user')
                    .distinct('user')
                    .lean()
            )

            await notificationManager.onParticipantAccepted(diving._id, participant._id, participantIds)

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
            // console.log(`mutation | completeDivingIfExist: args=${JSON.stringify(args)}`)
            await completeDivingIfExist()
            return {
                success: true
            }
        },
        async prepareDivingIfExist(parent, args, context, info) {
            // console.log(`mutation | prepareDivingIfExist: args=${JSON.stringify(args)}`)
            await prepareDivingIfExist(args.days)
            return {
                success: true
            }
        },
    },
};

async function prepareDivingIfExist(days) {
    let afterDays = new Date()
    afterDays.setDate(afterDays.getDate() + days)

    let afterDays10Minutes = new Date(afterDays.getTime() + 10 * 60 * 1000)

    let divings = await Diving.find({
        startedAt: {
            $gte: afterDays,
            $lte: afterDays10Minutes
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

async function updateParticipantStatus(divingId, participantId, participantStatus) {

    const participant = await User.findById(participantId)
    await DivingParticipant.updateOne(
        {
            diving: divingId,
            user: participantId
        },
        {
            status: participantStatus,
            name: participant.nickName,
            birth: participant.birth,
            gender: participant.gender,
            updatedAt: Date.now()
        },
        {
            upsert: true
        }
    )
}