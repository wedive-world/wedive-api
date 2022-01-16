const {
    User,
    Subscribe,
    Notification
} = require('../model/index').schema

module.exports.onDivingCreated = async (diving) => {

    if (!diving.diveCenters) {
        diving.diveCenters
            .forEach(async diveCenterId => {
                await onDivingCreatedInDiveCenter(diving, diveCenterId)
            });
    }

    if (!diving.divePoints) {
        diving.divePoints
            .forEach(async divePointId => {
                await onDivingCreatedInDivePoint(diving, divePointId)
            });
    }

    if (!diving.diveSites) {
        diving.diveSites
            .forEach(async diveSiteId => {
                await onDivingCreatedInDiveSite(diving, diveSiteId)
            });
    }

    let hostUser = await User.findById(diving.hostUser)
        .lean()

    if (hostUser.instructor) {
        await onDivingCreatedByInstructor(diving, hostUser.instructor)
    }
}

module.exports.onNewParticipantAtDiving = async (diving, user) => {
    await sendNotificationByUserIds(user._id, 'user', diving._id, 'diving', 'onParticipantAcceptedAtDiving', user, [diving.hostUser])
}

module.exports.onParticipantJoinedDiving = async (diving, participantId) => {

    let participantIds = diving.participants
        .filter(participant => participant.user)
        .map(participant => participant.user._id)

    participantIds.push(diving.hostUser._id)

    await sendNotificationByUserIds(participantId, 'user', diving._id, 'diving', 'onParticipantJoinedDiving', user, participantIds)
}

module.exports.onDivingStatusChanged = async (diving) => {
}

async function onDivingCreatedInDiveCenter(diving, diveCenterId) {
    await sendNotificationBySubscription(diving._id, 'diving', diveCenterId, 'diveCenter', 'onDivingCreatedInDiveCenter', diving)
}

async function onDivingCreatedInDivePoint(diving, divePointId) {
    await sendNotificationBySubscription(diving._id, 'diving', divePointId, 'divePoint', 'onDivingCreatedInDivePoint', diving)
}

async function onDivingCreatedInDiveSite(diving, diveSiteId) {
    await sendNotificationBySubscription(diving._id, 'diving', diveSiteId, 'diveSite', 'onDivingCreatedInDiveSite', diving)
}

async function onDivingCreatedByInstructor(diving, instructorId) {
    await sendNotificationBySubscription(diving._id, 'diving', instructorId, 'instructor', 'onDivingCreatedByInstructor', diving)
}

function firebaseClient() {
    const FirebaseClient = require('./fireabse-client')
    return new FirebaseClient()
}

async function getFcmTokenByUserIds(userIds) {
    return await User.find({ _id: { $in: userIds } })
        .select('fcmToken')
        .lean()
}

async function getUserIdsBySubjectId(targetId) {
    return await Subscribe.find({ targetId: targetId, value: true })
        .select('userId')
        .lean()
}

async function sendNotificationBySubscription(targetId, targetType, subjectId, subjectType, event, data) {
    let userIds = await getUserIdsBySubjectId(subjectId)
    await sendNotificationByUserIds(targetId, targetType, subjectId, subjectType, event, data, userIds)
}

async function sendNotificationByUserIds(targetId, targetType, subjectId, subjectType, event, data, userIds) {
    userIds.forEach(async userId => {
        await Notification.create({
            userId: userId,
            targetId: targetId,
            targetType: targetType,
            subjectId: subjectId,
            subjectType: subjectType,
            event: event,
            read: false
        })
    })

    sendNotification(userIds, event, {
        targetId: targetId,
        targetType: targetType,
        subjectId: subjectId,
        subjectType: subjectType,
        event: event,
        ...data
    })
}

async function sendNotification(userIds, data) {
    let tokenList = await getFcmTokenByUserIds(userIds)
    let result = await firebaseClient().sendMulticast(tokenList, data)
    console.log(`notification-manager | sendNotification: result=${JSON.stringify(result)}`)
}