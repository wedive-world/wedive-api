const {
    User,
    Diving
} = require('../model/index').schema

module.exports.getNotificationImage = async function (targetId, targetType, subjectId, subjectType, event) {
    switch (event) {
        case 'onParticipantAccepted':
            return await getUserImageUrl(targetId)

        case 'onParticipantJoined':
            return await getUserImageUrl(targetId)

        case 'onDivingPreparation':
            return await getDivingImageUrl(subjectId)

        case 'onDivingComplete':
            return await getDivingImageUrl(subjectId)

        default:
            return `Not defined event, ${event}`
    }
}

async function getUserImageUrl(userId) {
    let user = await User.findById(userId)
        .populate('profileImages')
        .lean()
    return user.profileImages && user.profileImages.length > 0
        ? user.profileImages[0].thumbnail
        : ""
}

async function getDivingImageUrl(divingId) {
    let diving = await Diving.findById(divingId)
        .populate({
            path: 'diveSites',
            populate: {
                path: 'images',
                model: 'Image'
            }
        }).populate({
            path: 'divePoints',
            populate: {
                path: 'images',
                model: 'Image'
            }
        }).populate({
            path: 'diveCenters',
            populate: {
                path: 'images',
                model: 'Image'
            }
        })
        .lean()
    let images = []
    if (diving.diveSites && diving.diveSites.length > 0) {
        iamgeIds = images.concat(diving.diveSites.images)
    }
    if (diving.divePoints && diving.divePoints.length > 0) {
        iamgeIds = images.concat(diving.divePoints.images)
    }
    if (diving.diveCenters && diving.diveCenters.length > 0) {
        iamgeIds = images.concat(diving.diveCenters.images)
    }
    if (images.length == 0) {
        return ""
    }

    return images[0].thumbnail
}