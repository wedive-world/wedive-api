const schema = require('../../model').schema;

const DiveCenter = schema.DiveCenter
const DiveSite = schema.DiveSite
const DivePoint = schema.DivePoint

const translator = require('../common/util/translator')

module.exports = {
    Query: {
        async getAllDiveCenters(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find()
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async getDiveCenterById(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenter = await DiveCenter.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(diveCenter, languageCode)
        },

        async getDiveCenterByUniqueName(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenter = await DiveCenter.findOne({ uniqueName: args.uniqueName })
                .lean()

            return translator.translateOut(diveCenter, languageCode)
        },

        async getDiveCentersNearBy(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()

            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async searchDiveCentersByName(parent, args, context, info) {

            console.log(`query | searchDiveCentersByName: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ $text: { $search: args.query } })
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

    },

    Mutation: {

        async upsertDiveCenter(parent, args, context, info) {

            console.log(`mutation | upsertDiveCenter: args=${args}`)
            let languageCode = context.languageCode

            let diveCenter = null

            if (!args.input._id) {
                diveCenter = new DiveCenter(args.input)

            } else {
                diveCenter = await DiveCenter.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof diveCenter[key] == typeof args.input[key])
                    .forEach(key => { diveCenter[key] = args.input[key] })

                diveCenter.updatedAt = Date.now()
            }

            diveCenter = translator.translateIn(diveCenter, args.input, languageCode)
            await diveCenter.save()

            let diveSite = await DiveSite.findOne({ _id: diveCenter.diveSiteId })
            if (diveSite) {
                if (!diveSite.diveCenters) {
                    diveSite.diveCenters = []
                }

                if (!diveSite.diveCenters.includes(diveCenter._id)) {
                    diveSite.diveCenters.push(diveCenter._id)
                }

                await diveSite.save()
            }

            let result = await DiveCenter.findOne({ _id: diveCenter._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },

        async deleteDiveCenterById(parent, args, context, info) {
            let result = await DiveCenter.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveCenterById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};