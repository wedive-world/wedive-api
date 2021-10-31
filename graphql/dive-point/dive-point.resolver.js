const schema = require('../../model').schema;

const DiveSite = schema.DiveSite
const DivePoint = schema.DivePoint
const Interest = schema.Interest
const Image = schema.Image
const Highlight = schema.Highlight

const translator = require('../common/util/translator')

module.exports = {

    DivePoint: {
        async interests(parent, args, context, info) {

            let languageCode = context.languageCode
            let interests = await Interest.find({ _id: { $in: parent.interests } })
                .lean()

            return interests.map(interest => translator.translateOut(interest, languageCode))
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },

        async backgroundImages(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.backgroundImages } })
                .lean()
        },

        async highlights(parent, args, context, info) {
            let languageCode = context.languageCode
            let highlights = await Highlight.find({ _id: { $in: parent.highlights } })
                .lean()
            return highlights.map(highlight => translator.translateOut(highlight, languageCode))
        },

        async month1(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month2(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month2 } })
                .lean()
        },

        async month3(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month3 } })
                .lean()
        },

        async month4(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month4 } })
                .lean()
        },

        async month5(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month5 } })
                .lean()
        },

        async month6(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month6 } })
                .lean()
        },

        async month7(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month7 } })
                .lean()
        },

        async month8(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month8 } })
                .lean()
        },

        async month9(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month9 } })
                .lean()
        },

        async month10(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month10 } })
                .lean()
        },

        async month11(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month11 } })
                .lean()
        },

        async month12(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month12 } })
                .lean()
        },
    },

    Query: {
        async getAllDivePoints(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getAllDivePoints: languageCode=${languageCode}`)

            let divePoints = await DivePoint.find()
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },
        async getDivePointById(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getDivePointById: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoint = await DivePoint.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(divePoint, languageCode)
        },
        async getDivePointsNearBy(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getDivePointsNearBy: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoints = await DivePoint.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },
        async searchDivePointsByName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | searchDivePointsByName: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoints = await DivePoint.find({ $text: { $search: args.query } })
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },

    },

    Mutation: {

        async upsertDivePoint(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`mutation | createDivePoint: languageCode=${languageCode}, args=${args}`)

            let divePoint = null

            if (!args.input._id) {
                divePoint = new DivePoint(args.input)

            } else {
                divePoint = await DivePoint.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof divePoint[key] == typeof args.input[key])
                    .forEach(key => { divePoint[key] = args.input[key] })

                divePoint.updatedAt = Date.now()
            }

            divePoint = translator.translateIn(divePoint, args.input, languageCode)
            await divePoint.save()

            let diveSite = await DiveSite.findOne({ _id: args.input.diveSiteId })
            if (!diveSite.divePoints) {
                diveSite.divePoints = []
            }

            if (!diveSite.divePoints.includes(divePoint._id)) {
                diveSite.divePoints.push(divePoint._id)
            }

            await diveSite.save()

            return translator.translateOut(divePoint, languageCode)
        },

        async deleteDivePointById(parent, args, context, info) {
            let result = await DivePoint.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivePointById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};