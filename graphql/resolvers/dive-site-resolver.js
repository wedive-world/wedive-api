const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest

module.exports = {

    DivePoint: {
        async interests(parent, args, context, info) {
            let divePoint = await DiveSite.find({ _id: parent._id })
            return await Interest.find({
                _id: {
                    $in: divePoint.interests
                }

            })
        },

        async images(parent, args, context, info) {
            let divePoint = await DiveSite.find({ _id: parent._id })
            return await Image.find({
                _id: {
                    $in: divePoint.images
                }
            })
        },

        async backgroundImages(parent, args, context, info) {
            let divePoint = await DiveSite.find({ _id: parent._id })
            return await Image.find({
                _id: {
                    $in: divePoint.backgroundImages
                }
            })
        },

        async divePoints(parent, args, context, info) {
            let divePoint = await DiveSite.find({ _id: parent._id })
            return await Image.find({
                _id: {
                    $in: divePoint.divePoints
                }
            })
        },
    },

    Query: {
        async diveSite(parent, args, context, info) {
            return await DiveSite.find({ _id: args._id })
        },

        async searchDiveSite(parent, args, context, info) {
            return await DiveSite.find({ _id: args._id })
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
            console.log(`mutation | diveSite: args=${args}`)

            let diveSite = null
            if (args.input._id) {
                diveSite = await DiveSite.findOne({ _id: args.input._id })
            } else {
                diveSite = new DiveSite(args.input)
            }

            return await diveSite.save()
        },
    }
};