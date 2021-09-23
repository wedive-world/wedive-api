const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest
const Image = schema.Image

module.exports = {

    DivePoint: {
        async interests(parent, args, context, info) {
            return await Interest.find({ _id: args.interests });
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: args.images })
        }
    },

    Query: {
        async divePoint(parent, args, context, info) {
            return await DivePoint.find({ _id: args.id })
        },
        async searchDivePoint(parent, args, context, info) {
            return await DivePoint.find({ _id: args.id })
        },
        async nearByDivePoint(parent, args, context, info) {
            return await DivePoint.find({
                $and: [
                    { latitude: { $gt: args.lat1 } },
                    { longitude: { $gt: args.lon1 } },
                    { latitude: { $lt: args.lat2 } },
                    { longitude: { $lt: args.lon2 } },
                ]
            })
        },
        async divePoints(parent, args, context, info) {
            return await DivePoint.find()
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