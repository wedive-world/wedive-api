const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest

module.exports = {

    DivePoint: {
        interests(parent, args, context, info) {
            return Interest.find({ _id: args.interests });
        },
    },

    Query: {
        async diveSite(parent, args, context, info) {
            return await DiveSite.find({ _id: args.id })
        },
        async searchDiveSite(parent, args, context, info) {
            return await DiveSite.find({ _id: args.id })
        },
        async nearByDiveSite(parent, args, context, info) {
            return await DiveSite.find({
                $and: [
                    { latitude: { $gt: args.lat1 } },
                    { longitude: { $gt: args.lon1 } },
                    { latitude: { $lt: args.lat2 } },
                    { longitude: { $lt: args.lon2 } },
                ]
            })
        },
        async diveSites(parent, args, context, info) {
            return await DiveSite.find()
        },
    },

    Mutation: {
        async diveSite(parent, args, context, info) {
            console.log(`createDiveSite: args=${args}`)
            let diveSite = new DiveSite(args.diveSiteInput)
            return await diveSite.save()
        },

        async diveSites(parent, args, context, info) {
            console.log(`createDiveSites: args=${args}`)

            let result = []

            for (arg of args) {
                const divesite = new DiveSite(arg)
                const savedDiveSite = await divesite.save()
                result.push(savedDiveSite)
            }

            return result
        },
    }
};