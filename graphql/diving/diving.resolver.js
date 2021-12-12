const {
    Diving
} = require('../../model').schema;

const translator = require('../common/util/translator')

module.exports = {

    Query: {
        async getAllDivings(parent, args, context, info) {

            return await Diving.find()
                .lean()
        },

        async getDivingById(parent, args, context, info) {
            return await Diving.findOne({ _id: args._id })
                .lean()
        },

        async getDivingsByHostUserId(parent, args, context, info) {
            return await Diving.find({ hostUser: args.hostUserId })
                .lean()
        },
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)
            //TODO check host user

            let diving = null

            if (!args.input._id) {
                diving = new Diving(args.input)

            } else {
                diving = await Diving.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof diving[key] == typeof args.input[key])
                    .forEach(key => { diving[key] = args.input[key] })

                diving.updatedAt = Date.now()
            }

            await diving.save()

            return diving
        },

        async deleteDivingById(parent, args, context, info) {
            let result = await Diving.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)
            return args._id
        },

        async joinDiving(parent, args, context, info) {
            let diving = await Diving.findOne({ _id: args.input._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)

            //TODO IMPL
            return {
                result: 'fail',
                reason: 'publicEnded'
            }
        },
    }
};