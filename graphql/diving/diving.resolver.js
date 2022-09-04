const Mongoose = require('mongoose');

const {
    Diving,
    DivingParticipant,
    DiveSite,
    DivePoint,
    DiveCenter,
    User
} = require('../../model').schema;

const notificationManager = require('../../controller/notification-manager')
const ChatServiceProxy = require('../../proxy/chat-service-proxy')
const chatServiceProxy = new ChatServiceProxy()

const {
    createHistoryFromDivingComplete뎃
} = require('../../controller/diving-history-manager')

module.exports = {
    Diving: {
        async participants(parent, args, context, info) {

            const divingParticipants = await DivingParticipant.find({ diving: Mongoose.Types.ObjectId(parent._id) })
                .populate('user')
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
                .skip(args.skip)
                .limit(args.limit)
                .lean()
        },

        async getDivingsByCurrentUser(parent, args, context, info) {

            let userId = await getUserIdFromUid(context.uid)
            return await Diving.find({
                participant: {
                    user: {
                        '_id': userId
                    }
                }
            })
                .skip(args.skip)
                .limit(args.limit)
                .lean()
        },

        async getDivingByChatRoomId(parent, args, context, info) {
            return await Diving.findOne({ chatRoomId: args.chatRoomId })
                .lean()
        },

        async getNearByDivings(parent, args, context, info) {

            return await getNearByDivings(args.lat, args.lng, args.skip, args.limit)
        },

        async getDivingsByPlaceId(parent, args, context, info) {

            return await getDivingsByPlaceId(args.placeId, args.activated, args.skip, args.limit)
        },

        getDivingsJoinedByCurrentUser: async (parent, args, context, info) => {

            let userId = await getUserIdFromUid(context.uid)
            return await getDivingsJoinedByUserId(userId, args.skip, args.limit)
        },

        getDivingsHostedByCurrentUser: async (parent, args, context, info) => {

            let userId = await getUserIdFromUid(context.uid)
            return await getDivingsHostedByUserId(userId, args.skip, args.limit)
        },

        getDivingsRelatedWithCurrentUser: async (parent, args, context, info) => {

            let userId = await getUserIdFromUid(context.uid)
            return await getDivingsRelatedWithUserId(userId, args.skip, args.limit)
        },
        getRecentDivings: async (parent, args, context, info) => {
            return await getRecentDivings(args.asc, args.skip, args.limit)
        },
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)

            let currentUser = await User.findOne({ uid: context.uid })
                .select('_id')
                .lean()

            if (!currentUser) {
                throw new Error('User not exist!')
            }

            let diving = null
            const isNewDiving = !args.input._id

            if (isNewDiving) {
                diving = new Diving(args.input)
                diving.hostUser = currentUser

                let userIds = args.input.participants
                    .filter(participant => participant.user)
                    .map(participant => participant.user)

                let users = await User.find({ _id: userIds })
                    .select('uid')
                    .lean()

                let memberUids = []
                if (users && users.length > 0) {
                    memberUids = users.map(user => user.uid)
                }

                let chatRoomId = await chatServiceProxy.createChatRoom(diving.title, memberUids, context.idToken)
                diving.chatRoomId = chatRoomId

            } else {
                diving = await Diving.findOne({ _id: args.input._id })
                    .populate('hostUser')
                    .populate('participants')

                if (context.uid != diving.hostUser.uid) {
                    throw new Error('invalid user')
                }

                Object.assign(diving, args.input)
                diving.updatedAt = Date.now()
            }

            await updateDivingProperties(diving)
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
            return await joinDiving(args.divingId, context.uid)
        },

        async acceptParticipant(parent, args, context, info) {
            console.log(`mutation | acceptParticipant: args=${JSON.stringify(args)}`)


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
        async updateDivingProperties(parent, args, context, info) {

            let divingCount = await Diving.count()
            for await (let skip of asyncGenerator(divingCount)) {
                let divings = await Diving.find()
                    .skip(skip)
                    .limit(1)

                let diving = divings[0]
                await updateDivingProperties(diving)
                await diving.save()
            }

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
        .lean()
    await DivingParticipant.updateOne(
        {
            diving: divingId
        },
        {
            status: participantStatus,
            user: participantId,
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

async function joinDiving(divingId, userUid) {

    const diving = await Diving.findOne({ _id: divingId })
        .populate('hostUser')
        .lean()

    if (diving.status != 'searchable') {
        return {
            success: false,
            reason: 'publicEnded'
        }
    }

    if (diving.hostUser.uid == userUid) {
        return {
            success: false,
            reason: 'hostCannotApply'
        }
    }


    const user = await User.findOne({ uid: userUid })
        .lean()

    let participantCount = await DivingParticipant.count({
        diving: Mongoose.Types.ObjectId(divingId),
        user: Mongoose.Types.ObjectId(user._id)
    })

    if (participantCount > 0) {
        return {
            success: false,
            reason: 'alreadyJoined'
        }
    }

    await updateParticipantStatus(diving._id, user._id, 'applied')
    await notificationManager.onParticipantJoinedDiving(diving._id, diving.hostUser._id, user._id)

    return {
        success: true
    }
}

async function updateDivingProperties(diving) {

    if (diving.startedAt && diving.finishedAt) {
        let days = diving.finishedAt.getTime() - diving.startedAt.getTime()
        days /= 86400000
        days = Math.round(days)
        days += 1

        diving.days = days
    }

    if (diving.maxPeopleNumber) {
        let applicantsNumber = diving.participants
            .filter(participant => participant.status == 'joined')
            .length

        diving.peopleLeft = diving.maxPeopleNumber - applicantsNumber
    }

    if (diving.divePoints && diving.divePoints.length > 0) {
        let divePoints = await DivePoint.find({ _id: { $in: diving.divePoints } })
            .lean()
            .select('interests location address')

        console.log(`diving.divePoints=${JSON.stringify(diving.divePoints, null, 2)} \ndivePoints=${JSON.stringify(divePoints, null, 2)}`)

        let divingInterests = divePoints.map(divePoint => divePoint.interests)
            .reduce((a, b) => a.concat(b))

        if (divingInterests && divingInterests.length > 0) {
            diving.interests = diving.interests.concat(Array.from(new Set(divingInterests)))
        }

        diving.address = divePoints[0].address
        diving.location = divePoints[0].location
    }

    if (diving.diveCenters && diving.diveCenters.length > 0) {
        let diveCenters = await DiveCenter.find({ _id: { $in: diving.diveCenters } })
            .lean()
            .select('interests location address')

        let divingInterests = diveCenters.map(diveCenter => diveCenter.interests)
            .reduce((a, b) => a.concat(b))

        if (divingInterests && divingInterests.length > 0) {
            diving.interests = diving.interests.concat(Array.from(new Set(divingInterests)))
        }

        diving.address = diveCenters[0].address
        diving.location = diveCenters[0].location
    }

    if (diving.diveSites && diving.diveSites.length > 0) {
        let diveSites = await DiveSite.find({ _id: { $in: diving.diveSites } })
            .lean()
            .select('interests location address')

        let divingInterests = diveSites.map(diveSite => diveSite.interests)
            .reduce((a, b) => a.concat(b))

        if (divingInterests && divingInterests.length > 0) {
            diving.interests = diving.interests.concat(Array.from(new Set(divingInterests)))
        }

        diving.address = diveSites[0].address
        diving.location = diveSites[0].location
    }
}

async function* asyncGenerator(n) {
    let i = 0;
    while (i < n) {
        yield i++;
    }
}

async function getNearByDivings(lat, lng, skip, limit) {
    return await Diving.find({
        startedAt: {
            $gt: Date.now()
        },
        location: {
            $near: {
                $maxDistance: 100000,
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            }
        }
    })
        .skip(skip)
        .limit(limit)
}

async function getDivingsByPlaceId(placeId, activated, skip, limit) {
    let findArgs = {
        $or: [
            {
                diveCenters: {
                    $elemMatch: {
                        $eq: placeId
                    }
                }
            },
            {
                diveSites: {
                    $elemMatch: {
                        $eq: placeId
                    }
                }
            },
            {
                divePoints: {
                    $elemMatch: {
                        $eq: placeId
                    }
                }
            }
        ]
    }

    if (activated) {
        findArgs.startedAt = {
            $gt: Date.now()
        }
    }

    return await Diving.find(findArgs)
        .sort('-updatedAt')
        .skip(skip)
        .limit(limit)
}

async function getDivingsJoinedByUserId(userId, skip, limit) {
    if (!userId) {
        throw Error('user not found')
    }

    return await Diving.find({
        participants: {
            user: {
                '_id': userId
            }
        }
    })
        .skip(skip)
        .limit(limit)
        .sort('-startedAt')
        .lean()
}

async function getDivingsHostedByUserId(userId, skip, limit) {
    if (!userId) {
        throw Error('user not found')
    }

    return await Diving.find({ hostUser: userId })
        .skip(skip)
        .limit(limit)
        .sort('-startedAt')
        .lean()
}

async function getDivingsRelatedWithUserId(userId, skip, limit) {
    if (!userId) {
        throw Error('user not found')
    }

    return await Diving.find({
        $or: [
            {
                participants: {
                    user: {
                        '_id': userId
                    }
                },
            },
            {
                hostUser: userId
            }

        ]
    })
        .skip(skip)
        .limit(limit)
        .sort('-startedAt')
        .lean()
}

async function getUserIdFromUid(uid) {
    let user = await User.findOne({ uid: uid })
        .select('_id')
        .lean()

    if (!user || !user._id) {
        throw Error('user not found')
    }

    return user._id
}

async function getRecentDivings(asc, skip, limit) {
    let order = asc
        ? '+startedAt'
        : '-startedAt'

    return await Diving.find()
        .skip(skip)
        .limit(limit)
        .sort(order)
        .lean()
}

async function acceptParticipant(divingId, currentUserUid, userId) {
    const diving = await Diving.findById(divingId)
        .populate('participants.user')
        .lean()

    if (!diving) {
        return {
            success: false,
            reason: "unkownDiving"
        }
    }

    if (diving.status != 'searchable') {
        return {
            success: false,
            reason: 'searchable'
        }
    }

    const currentUser = await User.findOne({ uid: currentUserUid })
        .lean()

    if (!currentUser || currentUser._id != diving.hostUser.toString()) {
        console.log(`diving-resolver | acceptParticipant: hostUser=${JSON.stringify(diving.hostUser)} currentUser=${JSON.stringify(currentUser)}`)
        return {
            success: false,
            reason: 'onlyHostCanAccept'
        }
    }

    let user = await User.findById(userId)
        .lean()

    if (!user) {
        return {
            success: false,
            reason: "unknownParticipant"
        }
    }

    let divingParticipant = await DivingParticipant({
        diving: Mongoose.Types.ObjectId(divingId),
        user: Mongoose.Types.ObjectId(userId)
    })
        .lean()

    if (!divingParticipant) {
        return {
            success: false,
            reason: "unknownParticipant"
        }
    }

    if (divingParticipant.status == 'joined') {
        return {
            success: false,
            reason: "alredayJoined"
        }
    }


    // if (!diving.chatRoomId) {
    //     let chatRoomId = await chatServiceProxy.createChatRoom(diving.title, [user.uid], context.idToken)
    //     console.log(`diving-resolver | acceptParticipant: chatRoomId=${JSON.stringify(chatRoomId)}`)
    //     await Diving.findByIdAndUpdate(diving._id, { chatRoomId: chatRoomId })

    // } else {
    try {
        await chatServiceProxy.invite({
            roomId: chatRoomId,
            uid: user.uid
        }, context.idToken)

    } catch (e) {
        console.error(`diving-resolver | acceptParticipant: chat invite error, `, e)
    }
    // }

    await updateParticipantStatus(diving._id, userId, 'joined')

    if (diving.maxPeopleNumber) {
        let applicantsNumber = diving.participants
            .filter(participant => participant.status == 'joined')
            .count()

        diving.peopleLeft = diving.maxPeopleNumber - applicantsNumber
    }

    await notificationManager.onParticipantAccepted(diving._id, user._id)

    return {
        success: true
    }
}