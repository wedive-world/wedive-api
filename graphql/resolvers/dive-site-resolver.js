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

            let countryCode = context.countryCode || 'ko'

            let diveSite = null
            if (args.input._id) {
                diveSite = await DiveSite.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key])
                    .forEach(key => { diveSite[key] = args.input[key] })

                diveSite.updatedAt = Date.now()

            } else {
                diveSite = new DiveSite(args.input)

                diveSite.nameTranslation = new Map()
                diveSite.descriptionTranslation = new Map()
                diveSite.addressTranslation = new Map()

                diveSite.nameTranslation[countryCode].set(countryCode, args.input.name)
                diveSite.descriptionTranslation[countryCode].set(countryCode, args.input.description)
                diveSite.addressTranslation[countryCode].set(countryCode, args.input.address)
            }

            let result = await diveSite.save()

            result.name = diveSite.nameTranslation[countryCode]
            result.description = diveSite.descriptionTranslation[countryCode]
            result.address = diveSite.addressTranslation[countryCode]
            
            return result
        },
    }
};