const schema = require('../../model').schema;

const DiveCenter = schema.DiveCenter
const DiveSite = schema.DiveSite
const DivePoint = schema.DivePoint
const Interest = schema.Interest
const Image = schema.Image

const translator = require('../common/util/translator')

module.exports = {

    DiveCenter: {
        async interests(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let interests = await Interest.find({ _id: { $in: parent.interests } })
                .lean()

            return interests.map(interest => translator.translateOut(interest, countryCode))
        },

        async diveSites(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveSites = await DiveSite.find({ _id: { $in: parent.diveSites } })
                .lean()

            return diveSites.map(diveSite => translator.translateOut(diveSite, countryCode))
        },

        async divePoints(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let divePoints = await DivePoint.find({ _id: { $in: parent.divePoints } })
                .lean()

            return divePoints.map(divePoint => translator.translateOut(divePoint, countryCode))
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },

        async backgroundImages(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.backgroundImages } })
                .lean()
        },
    },

    Query: {
        async getAllDiveCenters(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveCenters = await DiveCenter.find()
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, countryCode))
        },

        async getDiveCenterById(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveCenter = await DiveCenter.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(diveCenter, countryCode)
        },

        async getDiveCentersNearBy(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveCenters = await DiveCenter.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()

            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, countryCode))
        },
        async searchDiveCentersByName(parent, args, context, info) {

            console.log(`query | searchDiveCentersByName: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'
            let diveCenters = await DiveCenter.find({ $text: { $search: args.query } })
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, countryCode))
        },

    },

    Mutation: {

        async upsertDiveCenter(parent, args, context, info) {

            console.log(`mutation | upsertDiveCenter: args=${args}`)
            let countryCode = context.countryCode || 'ko'

            let diveCenter = null

            if (!args.input._id) {
                diveCenter = new DiveCenter(args.input)

            } else {
                diveCenter = await DiveCenter.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == args.input[key])
                    .forEach(key => { diveCenter[key] = args.input[key] })

                diveCenter.updatedAt = Date.now()
            }

            diveCenter = translator.translateIn(diveCenter, args.input, countryCode)
            await diveCenter.save()

            let diveSite = await DiveSite.findOne({ _id: result.diveSiteId })
            if (!diveSite.diveCenters) {
                diveSite.diveCenters = []
            }

            if (!diveSite.diveCenters.includes(diveCenter._id)) {
                diveSite.diveCenters.push(diveCenter._id)
            }

            await diveSite.save()

            return translator.translateOut(diveCenter, countryCode)
        },

        async deleteDiveCenterById(parent, args, context, info) {
            let result = await DiveCenter.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveCenterById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};