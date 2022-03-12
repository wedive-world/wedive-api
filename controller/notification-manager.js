const {
    User,
    Subscribe,
    Notification
} = require('../model/index').schema

const {
    getNotificationMessage,
    getNotificationTitle
} = require('./notification-message-manager')

const {
    getNotificationImage
} = require('./notification-image-manager')

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

module.exports.onParticipantAccepted = async (divingId, participantId, participantIds) => {
    await sendNotificationByUserIds(participantId, 'user', divingId, 'diving', 'onParticipantAccepted', participantIds)
}

module.exports.onParticipantJoinedDiving = async (divingId, hostUserId, userId) => {
    await sendNotificationByUserIds(userId, 'user', divingId, 'diving', 'onParticipantJoined', [hostUserId])
}

module.exports.onDivingPreparation = async (diving) => {

    let participantIds = diving.participants
        .filter(participant => participant.user)
        .map(participant => participant.user)

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
        .distinct('userId')
        .lean()
}

async function sendNotificationBySubscription(targetId, targetType, subjectId, subjectType, event, data) {
    let userIds = await getUserIdsBySubjectId(subjectId)
    if (!userIds || userIds.length == 0) {
        return
    }

    await sendNotificationByUserIds(targetId, targetType, subjectId, subjectType, event, data, userIds)
}

async function sendNotificationByUserIds(targetId, targetType, subjectId, subjectType, event, userIds) {
    try {
        await sendNotificationByUserIdsInternal(targetId, targetType, subjectId, subjectType, event, data, userIds)
    } catch (err) {
        console.error(`notification-manager | sendNotificationByUserIdsInternal: ${err}`)
    }
}
async function sendNotificationByUserIdsInternal(targetId, targetType, subjectId, subjectType, event, userIds) {
    let title = await getNotificationTitle(event)
    let message = await getNotificationMessage(targetId, targetType, subjectId, subjectType, event)
    let image = await getNotificationImage(targetId, targetType, subjectId, subjectType, event)

    userIds.forEach(async userId => {
        await Notification.create({
            userId: userId,
            targetId: targetId,
            targetType: targetType,
            subjectId: subjectId,
            subjectType: subjectType,
            event: event,
            title: title,
            message: message,
            image: image,
            read: false
        })
    })

    await sendNotification(userIds, {
        targetId: targetId,
        targetType: targetType,
        subjectId: subjectId,
        subjectType: subjectType,
        event: event,
        title: title,
        message: message,
        image: image,
    })
}

async function sendNotification(userIds, data) {
    let tokenList = await getFcmTokenByUserIds(userIds)
    let result = await firebaseClient().sendMulticast(tokenList, data)
    console.log(`notification-manager | sendNotification: result=${JSON.stringify(result)}`)
}