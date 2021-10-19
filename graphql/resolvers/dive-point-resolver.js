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
            let interests = await Interest.find({ _id: { $in: parent.interests } })
                .lean()

            return interests.map(interest => translator.translateOut(interest, countryCode))
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },

        async backgroundImages(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.backgroundImages } })
                .lean()
        },

        async month1(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month2(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month3(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month4(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month5(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month6(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month7(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month8(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month9(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month10(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month11(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },
        
        async month12(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },
    },

    Query: {
        async getAllDivePoints(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find()
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, countryCode))
        },
        async getDivePointById(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoint = await DivePoint.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(divePoint, countryCode)
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
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, countryCode))
        },
        async searchDivePointsByName(parent, args, context, info) {

            console.log(`query | searchDivePointsByName: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find({ $text: { $search: args.query } })
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, countryCode))
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
                    .lean()

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == args.input[key])
                    .forEach(key => { divePoint[key] = args.input[key] })

                divePoint.updatedAt = Date.now()
            }

            divePoint = translator.translateIn(divePoint, args.input, countryCode)
            await divePoint.save()

            let diveSite = await DiveSite.findOne({ _id: result.diveSiteId })
            if (!diveSite.divePoints) {
                diveSite.divePoints = []
            }

            if (!diveSite.divePoints.includes(divePoint._id)) {
                diveSite.divePoints.push(divePoint._id)
            }

            await diveSite.save()

            return translator.translateOut(divePoint, countryCode)
        },
        
        async deleteDivePointById(parent, args, context, info) {
            let result = await DivePoint.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivePointById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};