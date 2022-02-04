const {
    DivingHistory,
    User
} = require('../../model').schema;

module.exports = {

    User: {
        async divingHistoryLocations(parent, args, context, info) {

            return await DivingHistory.find({user: parent._id})
                .select('locations')
                .distinct()
                .lean()
        },
    }
}