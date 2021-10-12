const schema = require('../../model').schema;

const DiveSite = schema.DiveSite
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
        async getAllDivePoints(parent, args, context, info) {
    
            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find()
            return divePoints.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },
        async getDivePointById(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoint = await DivePoint.find({ _id: args._id })

            return translator.divePointTranslateOut(divePoint, countryCode)
        },
        async getDivePointsNearBy(parent, args, context, info) {
            
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
        async searchDivePointsByName(parent, args, context, info) {

            console.log(`query | searchDivePointsByName: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'
            let param = {
                $text: { $search: args.query }
            }
            let divePoints = await DivePoint.find(param)
            return divePoints.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },

    },

    Mutation: {

        async upsertDivePoint(parent, args, context, info) {

            console.log(`mutation | createDivePoint: args=${args}`)
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

            let diveSite = await DiveSite.findOne({ _id: result.diveSiteId })
            if (!diveSite.divePoints) {
                diveSite.divePoints = []
            }

            if (!diveSite.divePoints.includes(result._id)) {
                diveSite.divePoints.push(result.id)
            }

            await diveSite.save()

            return translator.divePointTranslateOut(result, countryCode)
        },

        
    }
};