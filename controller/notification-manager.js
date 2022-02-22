const {
    User,
    Subscribe,
    Notification
} = require('../model/index').schema

const {
    getNotificationMessage
} = require('./notification-message-manager')

module.exports.onDivingCreated = async (diving) => {

    if (diving.diveCenters && diving.diveCenters.length > 0) {
        diving.diveCenters
            .forEach(async diveCenterId => {
                await onDivingCreatedInDiveCenter(diving, diveCenterId)
            });
    }

    if (diving.divePoints && diving.divePoints.length > 0) {
        diving.divePoints
            .forEach(async divePointId => {
                await onDivingCreatedInDivePoint(diving, divePointId)
            });
    }

    if (diving.diveSites && diving.diveSites.length > 0) {
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

module.exports.onParticipantAccepted = async (diving, user) => {
    await sendNotificationByUserIds(user._id, 'user', diving._id, 'diving', 'onParticipantAccepted', participantIds)
}

module.exports.onParticipantJoinedDiving = async (diving, participantId) => {
    await sendNotificationByUserIds(participantId, 'user', diving._id, 'diving', 'onParticipantJoined', [diving.hostUser])
}

module.exports.onDivingPreparation = async (diving) => {

    let participantIds = diving.participants
        .filter(participant => participant.user)
        .map(participant => participant.user._id)

    participantIds.push(diving.hostUser._id)

    await sendNotificationByUserIds(diving._id, 'diving', diving._id, 'diving', 'onDivingPreparation', participantIds)
}

module.exports.onDivingComplete = async (diving) => {

    let participantIds = diving.participants
        .filter(participant => participant.user)
        .map(participant => participant.user._id)

    participantIds.push(diving.hostUser._id)

    await sendNotificationByUserIds(diving._id, 'diving', diving._id, 'diving', 'onDivingComplete', participantIds)
}

module.exports.onDivingPublicEnded = async (diving) => {
    let participantIds = diving.participants
        .filter(participant => participant.user)
        .map(participant => participant.user._id)

    participantIds.push(diving.hostUser._id)

    await sendNotificationByUserIds(diving._id, 'diving', diving._id, 'diving', 'onDivingPublicEnded', participantIds)
}

async function onDivingCreatedInDiveCenter(diving, diveCenterId) {
    await sendNotificationBySubscription(diving._id, 'diving', diveCenterId, 'diveCenter', 'onDivingCreatedInDiveCenter')
}

async function onDivingCreatedInDivePoint(diving, divePointId) {
    await sendNotificationBySubscription(diving._id, 'diving', divePointId, 'divePoint', 'onDivingCreatedInDivePoint')
}

async function onDivingCreatedInDiveSite(diving, diveSiteId) {
    await sendNotificationBySubscription(diving._id, 'diving', diveSiteId, 'diveSite', 'onDivingCreatedInDiveSite')
}

async function onDivingCreatedByInstructor(diving, instructorId) {
    await sendNotificationBySubscription(diving._id, 'diving', instructorId, 'instructor', 'onDivingCreatedByInstructor')
}

function firebaseClient() {
    const FirebaseClient = require('./fireabse-client')
    return new FirebaseClient()
}

async function getFcmTokenByUserIds(userIds) {
    return await User.find({ _id: { $in: userIds } })
        .select('fcmToken')
        .distinct('fcmToken')
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

async function sendNotificationByUserIds(targetId, targetType, subjectId, subjectType, event, userIds) {

    let message = await getNotificationMessage()

    userIds.forEach(async userId => {
        await Notification.create({
            userId: userId,
            targetId: targetId,
            targetType: targetType,
            subjectId: subjectId,
            subjectType: subjectType,
            event: event,
            message: message,
            read: false
        })
    })

    await sendNotification(userIds, {
        targetId: targetId,
        targetType: targetType,
        subjectId: subjectId,
        subjectType: subjectType,
        event: event,
        message: message
    })
}

async function sendNotification(userIds, data) {
    let tokenList = await getFcmTokenByUserIds(userIds)
    let result = await firebaseClient().sendMulticast(tokenList, data)
    console.log(`notification-manager | sendNotification: result=${JSON.stringify(result)}`)
}