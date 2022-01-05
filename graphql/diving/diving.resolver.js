const {
    Diving,
    User
} = require('../../model').schema;

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

            await diving.save()

            let chatRoomId = await chatServiceProxy.createChatRoom({
                name: diving.title,
                description: diving.description
            })

            diving.chatRoomId = chatRoomId
            await diving.save()

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
                .populate('participants.user')

            if (diving.status != 'searchable') {
                return {
                    success: false,
                    reason: 'publicEnded'
                }
            }

            let userUid = context.uid

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

            if (user && diving.hostUser == user._id) {
                return {
                    success: false,
                    reason: 'hostCannotApply'
                }
            }

            diving.participants.push({
                user: user._id,
                status: 'applied',
                name: user.nickName,
                birth: user.birth,
                gender: user.gender
            })

            await diving.save()

            return {
                success: true
            }
        },
        async inviteUser(parent, args, context, info) {
            let result = await updateParticipantStatus(args, context, 'joined')
            let user = await User.findById(args.userId)
            let inviteResult = await chatServiceProxy.invite({
                roomId: args.roomId,
                uid: user.uid
            }, context.idToken)

            console.log(`diving-resolver | inviteUser: inviteResult=${JSON.stringify(inviteResult)}`)
            return result
        },
        async kickUser(parent, args, context, info) {
            let result = await updateParticipantStatus(args, context, 'banned')
            let user = await User.findById(args.userId)
            let kickResult = await chatServiceProxy.kick({
                roomId: args.roomId,
                uid: user.uid
            }, context.idToken)

            console.log(`diving-resolver | kickUser: kickReesult=${JSON.stringify(kickResult)}`)
            return result
        },
    },
};

async function updateParticipantStatus(args, context, status) {

    let diving = await Diving.findOne({ _id: args.divingId })
        .populate('participants.user')

    if (diving.status != 'searchable') {
        return {
            success: false,
            reason: 'publicEnded'
        }
    }

    let userUid = context.uid
    let user = await User.findOne({ uid: userUid })
        .lean()

    if (user && diving.hostUser != user._id) {
        return {
            success: false,
            reason: 'hostCannotApply'
        }
    }

    let participant = diving.participants
        .filter(participant => participant.user)
        .find(participant => participant.user.uid == args.userId)

    if (!participant) {
        return {
            success: false,
            reason: 'alreadyApplied'
        }
    }

    participant.status = status
    await diving.save()

    return {
        success: true
    }
}