const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest
const Image = schema.Image

module.exports = {

    DivePoint: {
        async interests(parent, args, context, info) {
            let divePoint = await DivePoint.find({ _id: parent._id })
            return await Interest.find({
                _id: {
                    $in: divePoint.interests
                }

            })
        },

        async images(parent, args, context, info) {
            let divePoint = await DivePoint.find({ _id: parent._id })
            return await Image.find({
                _id: {
                    $in: divePoint.images
                }
            })
        },

        async backgroundImages(parent, args, context, info) {
            let divePoint = await DivePoint.find({ _id: parent._id })
            return await Image.find({
                _id: {
                    $in: divePoint.backgroundImages
                }
            })
        }
    },

    Query: {
        async divePoint(parent, args, context, info) {
            let result = await DivePoint.find({ _id: args._id })

            return result
        },
        async searchDivePoint(parent, args, context, info) {
            return await DivePoint.find({ _id: args._id })
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

        async divePoint(parent, args, context, info) {
            console.log(`mutation | divePoint: args=${args}`)
            let countryCode = context.countryCode || 'ko'


            let divePoint = null

            if (args.input._id) {

                divePoint = await DivePoint.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key])
                    .forEach(key => { divePoint[key] = args.input[key] })

                divePoint.updatedAt = Date.now()

            } else {
                divePoint = new DivePoint(args.input)

                divePoint.nameTranslation = new Map()
                divePoint.descriptionTranslation = new Map()
                divePoint.addressTranslation = new Map()

                divePoint.nameTranslation[countryCode].set(countryCode, args.input.name)
                divePoint.descriptionTranslation[countryCode].set(countryCode, args.input.description)
                divePoint.addressTranslation[countryCode].set(countryCode, args.input.address)
            }

            let result = await divePoint.save()
            return translate(result, countryCode)
        },
    }
};

function translate(divePoint, countryCode) {

    divePoint.name = divePoint.nameTranslation[countryCode]
    divePoint.description = divePoint.descriptionTranslation[countryCode]
    divePoint.address = divePoint.addressTranslation[countryCode]

    return divePoint
}
