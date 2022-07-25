const {
    User
} = require('../model').schema

module.exports.getUserIdByUid = getUserIdByUid

async function getUserIdByUid(uid) {
    if (!uid) {
        throw Error('uid is null')
    }
    
    let user = await User.findOne({ uid: uid })
        .select('_id')
        .lean()

    if (!user || !user._id) {
        throw Error('user not found')
    }

    return user._id
}