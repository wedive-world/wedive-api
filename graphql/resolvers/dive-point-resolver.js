const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const Interest = schema.Interest
const Image = schema.Image

const translator = require('./util/translator')

module.exports = {

    DivePoint: {
        async interests(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoint = await DivePoint.find({ _id: parent._id })
            let interests = await Interest.find({
                _id: {
                    $in: divePoint.interests
                }

            })

            return interests.map(interest => translator.interestTranslateOut(interest, countryCode))
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

            let countryCode = context.countryCode || 'ko'
            let divePoint = await DivePoint.find({ _id: args._id })

            return translator.divePointTranslateOut(divePoint, countryCode)
        },

        async searchDivePoint(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            console.log(`query | searchDivePoint: args=${JSON.stringify(args)}`)

            let param = {
                $text: { $search: args.query }
            }
            console.log(`query | searchDivePoint: param=${JSON.stringify(param)}`)
            
            let divePoints = await DivePoint.find(param)
            return divePoints.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },

        async nearByDivePoint(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
            return divePoints.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },

        async divePoints(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find()
            return divePoints.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },
    },

    Mutation: {

        async divePoint(parent, args, context, info) {

            console.log(`mutation | divePoint: args=${args}`)
            let countryCode = context.countryCode || 'ko'

            let divePoint = null

            if (!args.input._id) {
                divePoint = new DivePoint(args.input)

            } else {
                divePoint = await DivePoint.findOne({ _id: args.input._id })
                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == args.input[key])
                    .forEach(key => { divePoint[key] = args.input[key] })

                divePoint.updatedAt = Date.now()
            }

            divePoint = translator.divePointTranslateIn(divePoint, args.input, countryCode)
            let result = await divePoint.save()

            return translator.divePointTranslateOut(result, countryCode)
        },
    }
};