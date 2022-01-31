const {
    Diving,
    User
} = require('../../model').schema;

const notificationManager = require('../../controller/notification-manager')
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const chatServiceProxy = new ChatServiceProxy()

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
        }
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)

            let diving = null
            const isNewDiving = !args.input._id

            if (isNewDiving) {
                diving = new Diving(args.input)

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

            let chatRoomId = await chatServiceProxy.createChatRoom({
                name: diving.title,
                description: diving.description
            })

            diving.chatRoomId = chatRoomId
            await diving.save()
            await notificationManager.onDivingCreated(diving)

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
            await notificationManager.onParticipantJoinedDiving(rgs.userId, diving)

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
    },
};

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