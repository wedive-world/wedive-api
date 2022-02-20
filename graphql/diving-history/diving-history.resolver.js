const {
    DivingHistory,
    User
} = require('../../model').schema;

module.exports = {

    User: {
        async divingHistoryLocations(parent, args, context, info) {

            let divingLocations = await DivingHistory.find({ user: parent._id })
                .select('location.coordinates')
                .lean()

            // console.log(`query | User.divingHistoryLocations: divingLocations=${JSON.stringify(divingLocations)}`)

            return divingLocations.map(divingLocation => divingLocation.location.coordinates)
        },
    }
}