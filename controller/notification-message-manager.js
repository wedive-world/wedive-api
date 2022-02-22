const {
    User,
    Diving
} = require('../model/index').schema


module.exports.getNotificationMessage = async function (targetId, targetType, subjectId, subjectType, event) {
    switch (event) {
        case 'onParticipateAccepted':
            return await onParticipateAccepted(subjectId, targetId)

        case 'onParticipateJoined':
            return await onParticipateJoined(subjectId, targetId)

        case 'onDivingPreparation':
            return await onDivingPreparation(subjectId, targetId)

        case 'onDivingComplete':
            return await onDivingComplete(subjectId, targetId)
    }
}

async function onParticipateAccepted(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    let user = await User.findById(targetId)

    const message = '[%s] %s님이 새롭게 참여하였습니다.'
    return String.format(message, diving.title, user.name)
}

async function onParticipateJoined(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    let user = await User.findById(targetId)

    const message = '[%s] %s님이 참여 신청하였습니다. 함께 하시려면 승인해주세요.'
    return String.format(message, diving.title, user.name)
}

async function onDivingPreparation(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    const message = '[%s] 다이빙 출발 3일 전입니다. 다이빙 준비에 필요한 것들을 알려드릴게요.'
    return String.format(message, diving.title)
}

async function onDivingComplete(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    const message = '[%s] 다이빙은 어떠셨나요? 다이빙 로그와 사진을 남기고 추억을 보관해보세요.'
    return String.format(message, diving.title)
}