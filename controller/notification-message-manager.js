const {
    User,
    Diving
} = require('../model/index').schema

module.exports.getNotificationTitle = async function (event) {
    switch (event) {
        case 'onParticipantAccepted':
            return '새로운 다이빙 버디 발견'

        case 'onParticipantJoined':
            return '다이빙 버디 참가 신청'

        case 'onDivingPreparation':
            return '다이빙 출발 3일 전'

        case 'onDivingComplete':
            return '다이빙 완료'

        default:
            return `Not defined event, ${event}`
    }
}

module.exports.getNotificationMessage = async function (targetId, targetType, subjectId, subjectType, event) {
    switch (event) {
        case 'onParticipantAccepted':
            return await onParticipateAccepted(subjectId, targetId)

        case 'onParticipantJoined':
            return await onParticipateJoined(subjectId, targetId)

        case 'onDivingPreparation':
            return await onDivingPreparation(subjectId, targetId)

        case 'onDivingComplete':
            return await onDivingComplete(subjectId, targetId)

        default:
            return `Not defined event, ${event}`
    }
}

async function onParticipateAccepted(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    let user = await User.findById(targetId)

    const message = '[%s] %s님이 새롭게 참여하였습니다.'
    return parse(message, diving.title, user.name)
}

async function onParticipateJoined(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    let user = await User.findById(targetId)

    const message = '[%s] %s님이 참여 신청하였습니다. 함께 하시려면 승인해주세요.'
    return parse(message, diving.title, user.name)
}

async function onDivingPreparation(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    const message = '[%s] 다이빙 출발 3일 전입니다. 다이빙 준비에 필요한 것들을 알려드릴게요.'
    return parse(message, diving.title)
}

async function onDivingComplete(subjectId, targetId) {
    let diving = await Diving.findById(subjectId)
    const message = '[%s] 다이빙은 어떠셨나요? 다이빙 로그와 사진을 남기고 추억을 보관해보세요.'
    return parse(message, diving.title)
}

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}