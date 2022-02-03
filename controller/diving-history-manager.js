const {
    Diving,
    User,
    DiveSite,
    DivePoint,
    DiveCenter,
    DivingHistory,
    Review
} = require('../model').schema;

module.exports.createHistoryFromReview = async (reviewId) => {
    let review = await Review.findById(reviewId)

    if (!review) {
        return
    }

    let divingHistory = {}
    divingHistory.user = review.author
    divingHistory.hostUser = review.author

    const model = getModel(review.targetType)
    let place = await model.findById(review.targetId)

    if (!place) {
        return
    }

    divingHistory.title = `${model.name} 다이빙`
    divingHistory.latitude = place.latitude
    divingHistory.longitude = place.longitude
    divingHistory.location = place.location

    if (review.targetType == 'diveCenter') {
        divingHistory.diveCenters = [targetId]

    } else if (review.targetType == 'diveSite') {
        divingHistory.diveSites = [targetId]

    } else if (review.targetType == 'divePoint') {
        divingHistory.divePoints = [targetId]
    }

    await DivingHistory.create(divingHistory)
}

module.exports.createHistoryFromDivingComplete = async (divingId) => {
    let diving = await Diving.findById(divingId)

    if (!diving) {
        return
    }

    let userIds = []
    userIds.push(diving.hostUser)
    if (diving.participants) {
        diving.participants
            .map(participant => participant.user)
            .forEach(user => {
                if (!user) {
                    return
                }

                userIds.push(user)
            })
    }

    let divingHistories = []
    for (let userId of userIds) {
        let divingHistory = {}
        Object.assign(divingHistory, diving)
        divingHistory.user = userId

        let place = null
        if (diving.diveSites && diving.diveSites.length > 0) {
            place = await DiveSite.findById(diving.diveSites[0])

        } else if (diving.divePoints && diving.divePoints.length > 0) {
            place = await DivePoint.findById(diving.divePoints[0])

        } else if (diving.diveCenter && diving.diveCenters.length > 0) {
            place = await DiveCenter.findById(diving.diveCenters[0])
        }

        if (!place) {
            continue
        }

        divingHistory.title = `${place.name} 다이빙`
        divingHistory.latitude = place.latitude
        divingHistory.longitude = place.longitude
        divingHistory.location = place.location

        divingHistories.push(divingHistory)
    }

    if (divingHistories.length > 0) {
        await DivingHistory.insertMany(divingHistories)
    }
}

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite
    }
}